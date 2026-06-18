---
id: "tradeoffs"
order: 5
num: "05"
label: "Engineering Tradeoffs and Challenges"
screenLabel: "Engineering Tradeoffs and Challenges"
title: "Engineering Tradeoffs and Challenges"
---
<h3 class="sh" id="tradeoffs-durable-execution-engine">Durable Execution Engine</h3>
<img src="img/DBOS_vs_Lambda.svg" alt="Image of dbos vs aws lambda." style="display:block;width:75%;height:auto;margin:1.5rem auto;">

The two main options we considered were AWS Durable Lambdas and DBOS Transact. Since Amber’s infrastructure already relied on AWS services, AWS Durable Lambdas seemed like a natural fit. Durable Lambdas support long-running workflows without the 15 minute limit of standard AWS Lambda functions, which made them an attractive option.

Although AWS Durable Lambdas met many of Amber’s technical needs, we found that DBOS fit Amber’s architecture better. Amber was designed around an embedded SDK model where developers add durable execution into their existing applications through decorators. DBOS runs inside the developer’s application and only requires a Postgres database to provide durability, queue workflows, and store agent-specific traces.

With AWS Durable Lambdas, we would need more AWS services to accomplish the same thing. To support asynchronous execution, we would likely introduce services such as SQS or EventBridge to decouple request handling from workflow execution. For agent traces, a separate data store is needed to store that information because workflow checkpointing is abstracted behind AWS managed orchestration.

<h4 class="ssh">Tradeoffs</h4>

The main tradeoff of using DBOS is that queueing, durability, and storing of agent traces are all consolidated into Postgres. Under heavy workloads, this places greater pressure on the database and requires developers to monitor performance, connection limits, and worker concurrency more carefully.

We accepted this tradeoff because it aligned with Amber’s goal of being a lightweight, self-hosted durable execution platform with minimal infrastructure while still providing rich agent observability.

<h3 class="sh" id="agent-tracing-and-observability">Agent Tracing and Observability</h3>

<img src="img/phoenix.svg" alt="Image of Phoenix vs OpenAI TracingProcessor API." style="display:block;width:75%;height:auto;margin:1.5rem auto;">

One challenge in Amber was collecting agent traces and mapping each span correctly to its durable step. While DBOS provides workflow data, it does not capture agent-specific data such as LLM calls, tool invocations, or agent handoffs. Since Amber focuses on long-running AI agents, developers need visibility into both.

We first collected traces using an open-source observability platform, Arize Phoenix. The platform automatically captured traces using an instrumentation library, OpenInference, which was attractive. However, one problem was that the platform's data was not linked with DBOS’s data. As a result, resumed workflows were disconnected from the platform's observability data.

We dropped the platform but kept the instrumentation library to customize ourselves. While the library collected traces automatically, we stamped each span with its DBOS workflow ID. That tied every span to the step that produced it.

The library stored traces in a nested tree that captured which agent made each tool call and where subagents were handed off from. To pull them out, we wrote custom query logic that was tedious to maintain. To reduce code complexity, we switched our trace collection source directly to the OpenAI Agents SDK's TracingProcessor API. As a result, we did not need to write custom query logic to get the agent relationship data anymore.

<h4 class="ssh">Tradeoffs</h4>

The main tradeoff is that Amber’s tracing is more tightly coupled to the OpenAI Agents SDK, making support for other frameworks more limited. We accepted this tradeoff because it simplified our codebase, removed an unnecessary dependency, and provided cleaner agent-specific observability within Amber’s dashboard.

<h3 class="sh" id="embedded-sdk-architecture-vs-separate-runtime-server">Embedded SDK Architecture vs Separate Runtime Server</h3>
<img src="img/embedded_sdk.svg" alt="The embedded SDK avoids the extra network hop of a separate runtime server." style="display:block;width:100%;height:auto;margin:1.5rem auto;">

Our initial product decision was to have the developers host their agents on a runtime server that Amber would provide. The goal was to abstract away the durable execution runtime and manage it on the developer's behalf. However, this would require them to shape their application around our runtime, which created unnecessary friction.

Another observation we made was that the runtime server's main responsibility was only initializing the durable execution engine on behalf of the developer. Continuing with a separate runtime server meant introducing another network hop for developers who had their own application. Their application would first need to communicate with our runtime server to start a workflow.

As a result, we decided to remove the separate runtime server because it did not provide meaningful value to the developers. Since Amber is designed to support self-hosting, eliminating the runtime server also reduced infrastructure overhead by removing the need for an extra AWS ECS service.

We then simplified the SDK and made it easier for the developer to embed into their application. Instead of architecting their application around Amber, developers only need to import the SDK and decorate the functions or agents they want durable execution applied to.

<h4 class="ssh">Tradeoffs</h4>

One tradeoff of the embedded SDK approach is that the developer's application becomes tightly coupled to the durable execution runtime. If the developer’s application goes down, workflow execution pauses until it becomes available again.

We accepted this tradeoff because developers no longer need to provision and manage a separate runtime server.

