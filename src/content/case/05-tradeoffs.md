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

The two main options we considered were AWS Durable Lambdas and DBOS Transact. Since Amber’s infrastructure already relied on AWS services, AWS Durable Lambdas seemed like a natural fit. Durable Lambdas support long running workflows without the 15 minute limit of standard AWS Lambda functions, which made them an attractive option.

Although AWS Durable Lambdas met many of Amber’s technical needs, we found that DBOS fit Amber’s architecture better. Amber was designed around an embedded SDK model where developers add durable execution into their existing applications through decorators. We also wanted to provide a dashboard that combined workflow state with LLM calls, tool usage, and workflow progress.

With AWS Durable Lambdas, workflows would likely run inside Lambda functions triggered by the developer’s application. While this approach provides managed durability and scaling, it would have added more moving parts to the system. Workflow state, traces, and dashboard data would likely need to come from many AWS services and custom data stores to support the level of observability Amber wanted to provide.

<h4 class="ssh">Trade Offs</h4>

The main trade off of choosing DBOS is that Postgres becomes a critical part of the system. In Amber’s architecture, Postgres stores workflow state and also acts as the queue for workflows. Under heavy traffic, this can put more pressure on the database and requires monitoring of database performance, connection limits, and worker concurrency.

Another trade off is that Postgres becomes a larger dependency and possible bottleneck. Instead of spreading responsibility across several managed services, Amber keeps workflow durability, queueing, and observability data centered around Postgres. This simplified the architecture, but also made database sizing and monitoring more important.

We accepted these trade offs because they matched Amber’s goal of being a lightweight, self hosted durable execution platform with minimal infrastructure while still providing rich agent observability.

<h3 class="sh" id="agent-tracing-and-observability">Agent Tracing and Observability</h3>

[Placeholder image for phoenix and openai]

One challenge in Amber was collecting agent traces and mapping them correctly to each durable step. While DBOS provides workflow visibility, it does not capture agent-specific data such as LLM calls, tool invocations, or agent handoffs. Since Amber focused on long running AI agents, developers needed visibility into both.

Our first approach was to use Arize Phoenix, the open-source observability platform, but we recognized some problems. Phoenix uses the OpenInference library to automatically capture agent-specific data, which made it an attractive option. However, Phoenix introduced an unnecessary dependency. More importantly, the Phoenix traces were decoupled from DBOS workflow execution.

We then dropped Phoenix but kept their OpenInference instrumentation to collect traces ourselves. We associated each span to each of the DBOS steps by stamping the DBOS step identifier on each span. Although this improved integration, the trace structure did not map cleanly with a DBOS workflow’s structure. This inconsistency made querying and maintaining the data more difficult.

As a result, we decided to drop OpenInference entirely and collect traces directly from the OpenAI Agents SDK’s own TracingProcessor API to receive its native spans. Again, we then stamped each span with a DBOS workflow identifier. This allowed Amber to connect LLM calls, tool usage, and agent handoffs to the exact workflow step that produced them.

<h4 class="ssh">Trade Offs</h4>

The main trade off of this decision is that Amber’s tracing is more tightly coupled to the OpenAI Agents SDK, making support for other frameworks more limited. We accepted this trade off because it simplified our codebase, removed an unnecessary dependency, and provided cleaner agent-aware observability within Amber’s dashboard.

<h3 class="sh" id="embedded-sdk-architecture-vs-separate-runtime-server">Embedded SDK Architecture vs Separate Runtime Server</h3>
<img src="img/amber-embedded-vs-runtime.svg" alt="The embedded SDK avoids the extra network hop of a separate runtime server." style="display:block;width:100%;height:auto;margin:1.5rem auto;">

Our initial product decision was to have the developers host their agents on a runtime server that Amber would provide. The goal was to abstract away the durable execution runtime and manage it on the developer's behalf. However, we soon realized that most developers already have their own applications, and requiring them to shape their application around our runtime created unnecessary friction. Additionally, most developers are not bringing standalone agent files without an existing application.

Another observation we made was that the runtime server's main responsibility was only initializing the durable execution engine on behalf of the developer. Continuing with a separate runtime server meant introducing another network hop for developers who had their own application. Their application would first need to communicate with our runtime server to start a workflow. While this extra latency may seem trivial at first, it can compound when many workflows are being executed.

As a result, we decided to remove the separate runtime server because it did not provide meaningful value to the developers. Since Amber is designed to support self hosting, eliminating the runtime server also reduced infrastructure overhead by removing the need for an extra AWS ECS service.

We then simplified the SDK and made it easier for the developer to embed into their application. Instead of architecting their application around Amber, developers only need to import the SDK and decorate the functions or agents they want durable execution applied to.

<h4 class="ssh">Trade Offs</h4>

The user's application is tightly coupled to the durable execution runtime. If their application goes down the execution of workflow also stops until their application is back on. This tradeoff was worth it because they did not have to spin up an extra server to run the runtime. The workflows that are paused are still checkpointed to the Postgres database so nothing is lost. They resume as soon as the user’s application is back online. This mainly applies to localhost because in a production environment the user’s application can be scaled horizontally to account for one application going down.

One trade off of the embedded SDK approach is that the developer's application becomes tightly coupled to the durable execution runtime. If the application goes down, workflow execution also pauses until the application is available again. However, because workflows are checkpointed to Postgres, execution state is not lost. Once the application recovers, workflows can resume from their last checkpoint rather than restarting from the beginning.

This trade off was acceptable because developers no longer need to provision and manage an extra runtime server. In local development, downtime may pause workflow execution completely, but in production environments applications can be horizontally scaled to reduce the impact of a single instance failure.

