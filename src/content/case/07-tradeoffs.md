---
id: "tradeoffs"
order: 7
num: "07"
label: "Tradeoffs"
screenLabel: "Engineering Tradeoffs and Challenges"
title: "Engineering Tradeoffs and Challenges"
---
<h3 class="sh">Durable Execution Engine</h3>
<div class="aslot">
<p class="atag">Placeholder · diagram</p>
<p class="awhat">[Possibly add a diagram showing what the architecture with lambda could have looked like?] [Or very small one just showing you would need AWS SQS vs only Postgres]</p>
</div>

The two main options we considered were AWS Durable Lambdas and DBOS Transact. Since Amber's infrastructure already relied on AWS services, AWS Durable Lambdas seemed like a natural fit. Durable Lambdas support long running workflows without the 15 minute limit of standard AWS Lambda functions, which made them an attractive option.

Although AWS Durable Lambdas met many of Amber's technical needs, we found that DBOS fit Amber's architecture better. Amber was designed around an embedded SDK model where developers add durable execution into their existing applications through decorators. We also wanted to provide a dashboard that combined workflow state with LLM calls, tool usage, and workflow progress.

With AWS Durable Lambdas, workflows would likely run inside Lambda functions triggered by the developer's application. While this approach provides managed durability and scaling, it would have added more moving parts to the system. Workflow state, traces, and dashboard data would likely need to come from many AWS services and custom data stores to support the level of observability Amber wanted to provide.

<h3 class="sh">Trade offs</h3>

The main trade off of choosing DBOS is that Postgres becomes a critical part of the system. In Amber's architecture, Postgres stores workflow state and also acts as the queue for workflows. Under heavy traffic, this can put more pressure on the database and requires monitoring of database performance, connection limits, and worker concurrency.

Another trade off is that Postgres becomes a larger dependency and possible bottleneck. Instead of spreading responsibility across several managed services, Amber keeps workflow durability, queueing, and observability data centered around Postgres. This simplified the architecture, but also made database sizing and monitoring more important.

We accepted these trade offs because they matched Amber's goal of being a lightweight, self hosted durable execution platform with minimal infrastructure while still providing rich agent observability.

<h3 class="sh">Tracing</h3>

One of challenges was getting more agent specific traces combined with each durable execution step

How we ended up with our final solution - collecting traces via openAI agents SDK, enriching our workflow step data with traces - stamping with DBOS id

<ol class="bl">
<li>First Phoneix
<ol type="a">
<li>Realized unnecessary dependency, we didn't need their dashboard - because we providing our own</li>
<li>Also the trace stored was not connected to our DBOS status</li>
</ol>
</li>
<li>Tried OpenInference manually and stamping
<ol type="a">
<li>Stamping connecting it</li>
<li>removed the phoenix dashboard dependency but created traces - tree shaped
<ol type="i">
<li>But the shape of the traces was tree but DBOS is flat sequential -&gt; storing the wrong data structure that didn't match</li>
<li>It basically forced us to write query logic that was harder to read and maintain -</li>
</ol>
</li>
</ol>
</li>
<li>Finally we used openAI agents sdk directly to collect traces, still stamping i think
<ol type="a">
<li>This gave us the meta-data - tools, subagents, etc</li>
<li>While making the trace collection and query logic very clean/tidy</li>
<li>Trace collection was native to the framework we were supporting - it's traedoff we made - narrow doesn't support other framework but better fits our use case</li>
</ol>
</li>
</ol>

The result: we got tracing of metadata + easier to maintain + eliminated an unneeded dependency

How the stamping and join works:

The processor reads the DBOS workflow id and current step id when a span completes, and records them along with the event. The event is whatever the span captured, so an LLM call with its model and token counts, a tool call with its arguments and result, or a handoff from one agent to another. Once the events are tagged with those ids, they can be matched up later for use on the dashboard

<div class="aslot">
<p class="atag">Placeholder · figure</p>
<p class="awhat">Correlate on workflow_id + step_id</p>
</div>

<h3 class="sh">Embedded SDK Architecture vs Separate Runtime Server</h3>
<img src="img/amber-embedded-vs-runtime.svg" alt="The embedded SDK avoids the extra network hop of a separate runtime server." style="display:block;width:100%;height:auto;margin:1.5rem auto;">

Our initial product decision was to have the developers host their agents on a runtime server that Amber would provide. The goal was to abstract away the durable execution runtime and manage it on the developer's behalf. However, we soon realized that most developers already have their own applications, and requiring them to shape their application around our runtime created unnecessary friction. Additionally, most developers are not bringing standalone agent files without an existing application.

Another observation we made was that the runtime server's main responsibility was only initializing the durable execution engine on behalf of the developer. Continuing with a separate runtime server meant introducing another network hop for developers who had their own application. Their application would first need to communicate with our runtime server to start a workflow. While this extra latency may seem trivial at first, it can compound when many workflows are being executed.

As a result, we decided to remove the separate runtime server because it did not provide meaningful value to the developers. Since Amber is designed to support self hosting, eliminating the runtime server also reduced infrastructure overhead by removing the need for an extra AWS ECS service.

We then simplified the SDK and made it easier for the developer to embed into their application. Instead of architecting their application around Amber, developers only need to import the SDK and decorate the functions or agents they want durable execution applied to.

<h3 class="sh">Trade offs</h3>

One trade off of the embedded SDK approach is that the developer's application becomes tightly coupled to the durable execution runtime. If the application goes down, workflow execution also pauses until the application is available again. However, because workflows are checkpointed to Postgres, execution state is not lost. Once the application recovers, workflows can resume from their last checkpoint rather than restarting from the beginning.

This trade off was acceptable because developers no longer need to provision and manage an extra runtime server. In local development, downtime may pause workflow execution completely, but in production environments applications can be horizontally scaled to reduce the impact of a single instance failure.
