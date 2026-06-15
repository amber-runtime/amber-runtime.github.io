---
id: "built"
order: 5
num: "05"
label: "How we built it"
screenLabel: "How we built Amber"
title: "How we built Amber"
---
<h3 class="sh">High-Level Architecture</h3>

Amber is composed of five main subsystems:

<ol class="bl">
<li>Developer SDK</li>
<li>Durable Execution Engine</li>
<li>Worker Runtime</li>
<li>Observability Admin Dashboard</li>
<li>Self-hosted AWS Deployment</li>
</ol>

Together, these let developers define AI agents in their application code while Amber handles queueing, recovery, workflow state, observability, and cloud infrastructure.

<img src="img/amber-responsibilities.svg" alt="Amber's three responsibilities: build, run and recover, observe." style="display:block;width:100%;height:auto;margin:1.5rem auto;">

<h3 class="sh">Developer SDK</h3>

To use Amber the developer first imports the methods from the amber package into their Python application.

<div class="code">
<div class="chead"><span>[code block showing the import]</span><span>python</span></div>
<pre><span class="tok-kw">from</span> amber <span class="tok-kw">import</span> …</pre>
</div>

For more guidance on how to use these methods, please refer to the README docs for the amber-sdk <a href="https://github.com/amber-runtime/amber/blob/main/sdk/README.md">https://github.com/amber-runtime/amber/blob/main/sdk/README.md</a>

<h3 class="sh">Durable Execution Engine</h3>

Early in Amber's design, we debated whether to build our own durable execution system or adopt an existing solution.

At first, we considered building our own durable execution engine. However, we realized this would add significant complexity and slow development. Durable execution requires handling workflow checkpointing, retries, state persistence, failure recovery, and workflow resumption. These are difficult distributed systems problems. Since proven solutions already existed, we decided to check existing technologies instead

DBOS fits our architecture more naturally. DBOS runs directly inside the developer's application and only requires a Postgres database for durability, checkpointing, and queue-backed execution. More importantly, workflow state, queueing, and observability data could all live in one place. This simplified Amber's architecture and reduced the amount of infrastructure developers needed to manage.

<div class="aslot">
<p class="atag">Placeholder · diagram</p>
<p class="awhat">[Diagram of developer's application writing workflows to a postgres instance] [Or diagram of workflow being written to postgres but then dies and then resumes from checkpointed state]</p>
</div>

<h3 class="sh">Worker Runtime</h3>

Amber separates request handling from agent execution. The developer's application service accepts requests and enqueues agent workflows. A separate dedicated worker service drains the queues and performs the long running work. The reason for this is better separation of concerns and allows for individual scaling of the application server and worker service based on their own traffic.

<div class="aslot">
<p class="atag">Placeholder · diagram</p>
<p class="awhat">[Diagram showing how the developer's application only enqueues while we have a separate worker pool that drains from the queue (postgres)]</p>
</div>

<h3 class="sh">Observability Admin Dashboard</h3>

One challenge we encountered when building Amber was observability for durable agent workflows. The current tools solve separate problems. Tools like Phoenix and Braintrust solve the agent visibility problem through usage of spans, LLM calls, and tool invocations. However, they are not workflow durability focused and do not show what happens during execution.

On the other hand, durable workflow platforms like Temporal and Inngest focus on workflow orchestration. They provide insight into workflow state, retries, failures, and the execution state, but do not provide agent specific information. If you want agent specific information you have to connect through a third party tool.

Since Amber focuses on durable execution for AI agents, we found that developers needed insight into both agent related information and durable execution state. The reason is because when an agent workflow fails and eventually recovers, we as developers need to understand the why and what the current agent information that led to that state.

As a result, we designed Amber's admin dashboard to combine both perspectives into a single interface. The dashboard provides workflow level visibility while also showing AI specific information such as LLM calls, tool invocations, token cost, just to name a few. This gives the developers enough context to debug failure states and inspect long running workflows to better understand the agent behavior.

<div class="aslot">
<p class="atag">Placeholder · figure</p>
<p class="awhat">Workflow timeline · crash + recovery</p>
</div>
<div class="aslot">
<p class="atag">Placeholder · screenshot</p>
<p class="awhat">[Screenshot of dashboard? And then remove it from the walkthrough?]</p>
</div>

<h3 class="sh">Self-hosted AWS Deployment</h3>

Amber was designed to help developers deploy their application to their own AWS account. We make this easy with the use of the Amber CLI.

The major deployment pieces are CloudFront, ECS Fargate, RDS, and supporting AWS services.

<strong>CloudFront:</strong>

CloudFront routes traffic by path:

<ol class="bl">
<li>Application API requests go to the developer's FastAPI service.</li>
<li>Dashboard UI requests go to the Amber admin React frontend.</li>
<li>Dashboard API requests go to a separate FastAPI service and require Cognito authentication.</li>
<li>If the developer's application includes a React frontend, CloudFront serves that frontend at / and routes the FastAPI service under /api/*.</li>
</ol>

The dashboard frontend loads in the browser and then uses Cognito sign in before requesting workflow data from the dashboard API.

<div class="aslot">
<p class="atag">Placeholder · diagram</p>
<p class="awhat">[Diagram of the different routes when it hits cloudfront and then ALB? Maybe show S3 bucket serving the react frontends too]</p>
</div>

<strong>ECS Fargate and RDS:</strong>

Amber deploys three main ECS services:

<ol class="bl">
<li>Developer's application FastAPI service which handles API requests and enqueues agent workflows.</li>
<li>Developer's worker service which drains queued workflows and executes long running agent workflows.</li>
<li>Admin Dashboard API service which reads workflow state and displays the information to the dashboard UI.</li>
</ol>

All three ECS services connect through RDS Proxy to RDS Postgres. Postgres stores the durable workflow state, queue state, step history, and agent event data used by Amber.

<strong>Supporting AWS Services:</strong>

List of supporting AWS services:

<ol class="bl">
<li>ECR stores the developer's application, worker, and dashboard API container images.</li>
<li>SSM Parameter Store stores OpenAI API key.</li>
<li>Secrets Manager stores the database connection URL and RDS Proxy credentials.</li>
<li>S3 serves the static frontend assets for the Amber admin dashboard and if configured the developer's React frontend.</li>
<li>Cognito manages authentication for the admin dashboard.</li>
<li>CloudWatch collects service logs and queue metrics for ECS autoscaling.</li>
</ol>
<div class="aslot">
<p class="atag">Placeholder · diagram</p>
<p class="awhat">[Full AWS diagram of Amber]</p>
</div>
