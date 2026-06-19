---
id: "built"
order: 4
num: "04"
label: "How we built Amber"
screenLabel: "How we built Amber"
title: "How we built Amber"
---
<h3 class="sh" id="high-level-architecture">High-Level Architecture</h3>

To better understand how we built and deploy Amber, let's look at a high level overview of the components.

<img src="img/aws-highlevel.svg" alt="High level look of Amber components." style="display:block;width:100%;height:auto;margin:1.5rem auto;">

Amber's architecture is composed of the following layers:
<ol class="bl">
<li>Web layer, which routes traffic and hosts the Dashboard frontend and any optional Agent frontends.</li>
<li>Application layer, which hosts the Agents built with our SDK. In addition to hosting the Agents, this layer is also home to the Dashboard backend and worker pool.</li>
<li>Data layer, where Agent execution steps are queued and the results stored.</li>
</ol>

The first component we will discuss is the durable execution engine itself, which is part of the application layer.

<h3 class="sh" id="durable-execution-engine">Durable Execution Engine</h3>

<img src="img/DBOS.svg" alt="DBOS logo" style="display:block;width:200px;height:150px;object-fit:contain;margin:0 0 .5rem 0;">

Early in Amber’s design, we debated whether to build our own durable execution system or adopt an existing solution.

We ended up selecting DBOS because it aligned with Amber’s goal of keeping the architecture simple. DBOS runs directly inside the developer’s application and only requires a Postgres database for durability. Instead of relying on a separate queueing system, DBOS uses Postgres itself to persist and schedule workflow execution.

Workflow state, queueing, and observability data could all live in one place. This simplified Amber’s architecture and reduced the infrastructure developers needed to manage.

<img src="img/enqueue-workflow.svg" alt="Diagram of agents writing to a queue on postgres instance." style="display:block;width:100%;height:auto;margin:1.5rem auto;">

<h3 class="sh" id="worker-runtime">Worker Runtime</h3>

Originally, Amber supported both immediate and queued workflow execution. However, requiring developers to choose between execution models added unnecessary complexity. Since Amber primarily targets long running agent workflows that may pause, fail, or resume, we standardized on queued execution.

As a result, Amber separates request handling from long-running agent execution. The developer’s application service running in AWS ECS accepts requests and enqueues agent workflows in Postgres. A dedicated worker service in AWS ECS then drains the queue and performs the long running work. This removes the need for a separate queueing system like AWS SQS.

This separation allows the application service and worker runtime to scale independently based on their own traffic patterns.

<img src="img/dequeue-workflow.svg" alt="Diagram of workers dequeueing from postgres instance." style="display:block;width:100%;height:auto;margin:1.5rem auto;">

At this point, Amber could define durable agent workflows and execute them reliably. The next challenge was deployment. Since Amber is self-hosted, developers needed a way to run these components inside their own AWS account.

To make the AWS architecture easier to understand, we break it down into its major components before showing how everything fits together.

<h3 class="sh" id="self-hosted-aws-deployment">Self-hosted AWS Deployment</h3>

<img src="img/aws_logo.png" alt="aws logo" style="display:block;width:200px;height:100px;object-fit:contain;margin:0 0 .5rem 0;">

To simplify deployment, we built the Amber CLI to provision the required infrastructure and deploy the application runtime in a couple of commands.

The major deployment pieces are CloudFront (AWS's Content delivery and routing), ECS Fargate (AWS's serverless container runtime), RDS (AWS's managed relational database service), and supporting AWS services.

<h4 class="ssh" id="cloudfront">CloudFront</h4>

CloudFront routes traffic by path:

<ol class="bl">
<li>Application API requests go to the developer's FastAPI service.</li>
<li>Dashboard UI requests go to the Amber Dashboard frontend written in React.</li>
<li>Dashboard API requests go to a separate FastAPI service and require Cognito authentication.</li>
<li>If the developer's application includes a React frontend, CloudFront serves that frontend at <code>/</code> and routes the FastAPI service under <code>/api/*</code>.</li>
</ol>

The dashboard frontend loads in the browser and then uses Cognito sign in before requesting workflow data from the dashboard API.

<img src="img/cloudfront-routes.svg" alt="Diagram showing the routes that user requests can take through Cloudfront" style="display:block;width:100%;height:auto;margin:1.5rem auto;" data-lightbox-image tabindex="0" role="button" aria-label="Open CloudFront routes diagram">

<h4 class="ssh" id="ecs-fargate-and-rds">ECS Fargate and RDS</h4>

Amber deploys three main ECS Fargate services, which are containerized applications that run without requiring developers to manage severs:

<ol class="bl">
<li>Developer's application FastAPI service which handles API requests and enqueues agent workflows.</li>
<li>Developer's worker service which drains queued workflows and executes long-running agent workflows.</li>
<li>Admin Dashboard API service which reads workflow state and displays the information to the dashboard UI.</li>
</ol>

All three services connect through RDS Proxy to RDS Postgres, a managed PostgreSQL database. Postgres stores the durable workflow state, queue state, step history, and agent event data used by Amber.

<img src="img/compute-data-layer.svg" alt="Diagram showing the agent, worker, and dashboard backend and how they communicate with the data layer" style="display:block;width:100%;height:auto;margin:1.5rem auto;">

<h4 class="ssh" id="supporting-aws-services">Supporting AWS Services</h4>

List of supporting AWS services:

<ol class="bl">
<li>ECR stores the developer's application, worker, and dashboard API container images.</li>
<li>SSM Parameter Store stores OpenAI API key.</li>
<li>Secrets Manager stores the database connection URL and RDS Proxy credentials.</li>
<li>S3 serves the static frontend assets for the Amber admin dashboard and, if configured, the developer's React frontend.</li>
<li>Cognito manages authentication for the admin dashboard.</li>
<li>CloudWatch collects service logs and queue metrics for ECS autoscaling.</li>
</ol>


<img src="img/supporting-services.svg" alt="Diagram showing the services that support the AWS infrastructure: ECR, Parameter Store, Secrets Manager, S3 Bucket, Cognito, and Cloudwatch." style="display:block;width:100%;height:auto;margin:1.5rem auto;">

<h4 class="ssh" id="full-aws-diagram-of-amber">Full AWS Diagram of Amber</h4>

<img src="img/full-architecture.svg" alt="Diagram showing the full detailed Amber AWS architecture with all of its components." style="display:block;width:100%;height:auto;margin:1.5rem auto;" data-lightbox-image tabindex="0" role="button" aria-label="Open full AWS architecture diagram">
