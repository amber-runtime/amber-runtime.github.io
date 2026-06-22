---
id: "existing"
order: 2
num: "02"
label: "Existing solutions"
screenLabel: "Existing solutions"
title: "Existing solutions"
---
Choosing a durable execution platform requires weighing three key factors:
<ol class="bl">
	<li>To what degree the runtime is proprietary: some are fully open source, while others let you view the source code but restrict how it can be used, modified, or commercialized.</li>
	<li>Whether you self-host the runtime or consume it as a managed cloud service.</li>
	<li>The infrastructure that each runtime requires to run, ranging from a single process backed by one database to a distributed cluster of services.</li>
</ol>

The first two matter most to teams with privacy or compliance needs that require execution to stay inside their own systems; the third drives the ongoing cost of running it there.

Three existing solutions we considered were DIY, Temporal, and Inngest.

<h3 class="sh" id="diy">DIY</h3>

DIY suits teams that want full control and accept the implementation burden that comes with it. Handling workflow durability yourself means building the underlying infrastructure from components like stateful job queues, database-backed state machines, and checkpointing logic.

As these systems grow, that infrastructure code becomes increasingly difficult to maintain, test, and keep reliable. They often require more effort to reach the same level of resilience as a purpose‑built platform, and may miss edge cases that dedicated systems already handle.

<img src="/img/Temporal_logo.png" alt="Temporal durable execution logo" style="display:block;width:100px;height:100px;object-fit:contain;margin:0 0 .5rem 0;">

<h3 class="sh" id="temporal" style="margin-top:0;">Temporal</h3>

Temporal is a general-purpose workflow engine with multi-language SDKs and a deep feature set, used by many large companies at scale. It is fully open source and can be self-hosted or run as a managed cloud service. Temporal is a proven technology with real world results.

Comparatively, Temporal demands the most significant restructuring of the codebase. Code must be organized around a stricter workflow model involving two layers.

Additionally, running Temporal requires operating a cluster of services, which can be a significant burden for a smaller team to self-host and maintain.

<img src="/img/inngest_inc_logo.png" alt="Inngest logo" style="display:inline-block;width:100px;height:100px;object-fit:contain;vertical-align:middle;margin:0 .5rem 0 0;">

<h3 class="sh" id="inngest" style="margin-top:0;">Inngest</h3>

Inngest, like Temporal, offers a cloud service that manages durable execution, but it simplifies the developer experience significantly. It also requires less infrastructure to run.

While the source code for Inngest is available, and self-hosting Inngest is possible, the license for the source code is not exactly open source. This lack of clarity may deter developers and organizations who are looking to self-host or have concerns about privacy and data compliance.

While the market for durable execution has several strong solutions, these existing solutions leave a gap in the market. Smaller organizations that want to self-host for cost or compliance reasons do not have a simple solution that combines good developer experience and easy to manage infrastructure.

<img src="/img/existing-solutions.svg" alt="Existing solutions table" style="width:70%">

Amber is fully open source and self-hosted on Amazon Web Services (AWS).

It builds on DBOS, an open-source durable execution engine that runs embedded within the application rather than as a separate service, and relies on Postgres alone for infrastructure.

While Amber does not yet support multiple agent frameworks, it offers native integration with the OpenAI Agents SDK, written in Python. We chose the OpenAI Agents SDK as it's among the most widely adopted frameworks for building agents.
