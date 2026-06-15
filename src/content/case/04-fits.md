---
id: "fits"
order: 4
num: "04"
label: "Where Amber fits"
screenLabel: "Where Amber fits"
title: "Where Amber fits"
---
Amber fills the gap that the existing tools leave open. For developers who want self-hosted durable execution without adding bulky infrastructure, Amber builds on DBOS. DBOS is a durable execution engine that runs embedded in the developer's application, and relies on Postgres alone for persistence and recovery. Nothing else has to be deployed or run alongside the application.

Another angle Amber tackles is agent observability. While many full-featured observability tools already exist, they only record data on each individual span, not on the status of a workflow overall. Durable execution engines are the reverse: they track and recover a workflow's state, but can't see inside the agent, its tool calls, its LLM input and output, or its token usage and cost. Amber does both, recovering the workflow and giving visibility into the agent running inside it.

<img src="img/amber-capability-table.svg" alt="Only Amber covers agent-aware tracing, workflow-state visibility, token cost, and durable execution." style="display:block;width:100%;height:auto;margin:1.5rem auto;">
