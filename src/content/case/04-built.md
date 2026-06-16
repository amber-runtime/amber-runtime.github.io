---
id: "built"
order: 4
num: "04"
label: "How we built Amber"
screenLabel: "How we built Amber"
title: "How we built Amber"
---
<h3 class="sh" id="high-level-architecture">High-Level Architecture</h3>

To better understand how we built Amber, we start by presenting a high level overview of the components of Amber.

[Diagram of the 5 components]

Amber is composed of five main subsystems:
<ol class="bl">
<li>Developer SDK</li>
<li>Durable Execution Engine</li>
<li>Worker Runtime</li>
<li>Observability Admin Dashboard</li>
<li>Self-hosted AWS Deployment</li>
</ol>

Together, these let developers define AI agents in their application code while Amber handles queueing, recovery, workflow state, observability, and cloud infrastructure.

<h3 class="sh" id="durable-execution-engine">Durable Execution Engine</h3>

Early in Amber’s design, we debated whether to build our own durable execution system or adopt an existing solution.

At first, we considered building our own durable execution engine. However, we realized this would add significant complexity and slow development. Building a reliable durable execution system is hard. It requires solving difficult distributed systems problems. Since proven solutions already existed, we decided to evaluate existing technologies instead.

<img src="img/DBOS.svg" alt="DBOS logo" style="display:block;width:200px;height:150px;object-fit:contain;margin:0 0 .5rem 0;">

We ended up selecting DBOS because it aligned with Amber’s goal of keeping the architecture simple. DBOS runs directly inside the developer’s application and only requires a Postgres database for durability and queue-backed execution. Workflow state, queueing, and observability data could all live in one place. This simplified Amber’s architecture and reduced the infrastructure developers needed to manage.

DBOS’s queue backed execution model also influenced how we structured Amber’s runtime architecture. Since workflows could be persisted and executed asynchronously, we needed to decide how agent execution should be handled.

<div class="aslot">
<p class="atag">Placeholder · diagram</p>
<p class="awhat">[Diagram of developer's application writing workflows to a postgres instance] [Or diagram of workflow being written to postgres but then dies and then resumes from checkpointed state]</p>
</div>

<h3 class="sh" id="worker-runtime">Worker Runtime</h3>

Originally, Amber supported both immediate and queued workflow execution. However, requiring developers to choose between execution models added unnecessary complexity. Since Amber primarily targets long running agent workflows that may pause, fail, or resume, we standardized on queued execution.

As a result, Amber separates request handling from agent execution through a queue backed execution model. The developer’s application service running in AWS ECS accepts requests and enqueues agent workflows in Postgres. A dedicated worker service in AWS ECS then drains the queue and performs the long running work. This removes the need for a separate queueing system like AWS SQS.

This separation allows the application service and worker runtime to scale independently based on their own traffic patterns.

<div class="aslot">
<p class="atag">Placeholder · diagram</p>
<p class="awhat">[Diagram showing how the developer's application only enqueues while we have a separate worker pool that drains from the queue (postgres)]</p>
</div>

At this point, Amber could define durable agent workflows and execute them reliably. The next challenge was deployment. Since Amber is self hosted, developers needed a way to run these components inside their own AWS account.

To make the AWS architecture easier to understand, we break it down into its major components before showing how everything fits together.

<h3 class="sh" id="self-hosted-aws-deployment">Self-hosted AWS Deployment</h3>

<img src="img/aws_logo.png" alt="aws logo" style="display:block;width:200px;height:100px;object-fit:contain;margin:0 0 .5rem 0;">

To simplify deployment, we built the Amber CLI to provision the required infrastructure and deploy the application runtime in a couple of commands.

The major deployment pieces are CloudFront, ECS Fargate, RDS, and supporting AWS services.

<h4 class="ssh" id="cloudfront">CloudFront</h4>

CloudFront routes traffic by path:

<ol class="bl">
<li>Application API requests go to the developer's FastAPI service.</li>
<li>Dashboard UI requests go to the Amber admin React frontend.</li>
<li>Dashboard API requests go to a separate FastAPI service and require Cognito authentication.</li>
<li>If the developer's application includes a React frontend, CloudFront serves that frontend at <code>/</code> and routes the FastAPI service under <code>/api/*</code>.</li>
</ol>

The dashboard frontend loads in the browser and then uses Cognito sign in before requesting workflow data from the dashboard API.

<div class="aslot">
<p class="atag">Placeholder · diagram</p>
<p class="awhat">[Diagram of the different routes when it hits cloudfront and then ALB? Maybe show S3 bucket serving the react frontends too]</p>
</div>

<h4 class="ssh" id="ecs-fargate-and-rds">ECS Fargate and RDS</h4>

Amber deploys three main ECS services:

<ol class="bl">
<li>Developer's application FastAPI service which handles API requests and enqueues agent workflows.</li>
<li>Developer's worker service which drains queued workflows and executes long running agent workflows.</li>
<li>Admin Dashboard API service which reads workflow state and displays the information to the dashboard UI.</li>
</ol>

All three ECS services connect through RDS Proxy to RDS Postgres. Postgres stores the durable workflow state, queue state, step history, and agent event data used by Amber.

<div class="aslot">
<p class="atag">Placeholder · diagram</p>
<p class="awhat">[Diagram of the three ecs services and RDS Proxy and RDS]</p>
</div>

<h4 class="ssh" id="supporting-aws-services">Supporting AWS Services</h4>

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
<p class="awhat">[Diagram of each of the individual services by itself]</p>
</div>

<h4 class="ssh" id="full-aws-diagram-of-amber">Full AWS Diagram of Amber</h4>

<div class="aslot">
<p class="atag">Placeholder · diagram</p>
<p class="awhat">[Full AWS diagram of Amber]</p>
</div>
