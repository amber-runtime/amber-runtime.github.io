---
id: "existing"
order: 2
num: "02"
label: "Existing solutions"
screenLabel: "Existing solutions"
title: "Existing solutions"
---
<h3 class="sh">DIY</h3>

Prior to these durable execution projects, developers had to figure out ways to handle workflow durability on their own. Home-grown solutions were often developed such as stateful queues or job handlers, database-stored state machines, and complex checkpointing code. As these systems grew more complex, this infrastructure code can become increasingly difficult to maintain, test, and make reliable.

It is important to note that DIY solutions are not necessarily "battle tested" to handle many different types of failures. Homegrown solutions often require more effort to reach the same level of resilience as a purpose-built platform, and may miss edge cases that dedicated systems already handle. Organizations might not be comfortable with critical business systems relying on unproven durability architecture.

<h3 class="sh">Temporal</h3>

Temporal is the open source fork of "Cadence", a project created at Uber. Uber is known to have a large-scale distributed micro-services architecture, with thousands of different micro-services. "Cadence" was their own internal project to add a layer of reliability to this infrastructure, and the founding team eventually forked it and founded Temporal. Temporal offers a hosted cloud platform for companies for developers that are seeking to add durable execution to their application logic. Because it is open source, it is possible to self-host a Temporal cluster, which can be important for organizations that have privacy and compliance concerns.

Coming from such a large, successful company like Uber, Temporal is a proven technology with real world results. However, there are some aspects which may not appeal to all developers. Code must be organized into two layers; deterministic code and code with side effects must be handled differently. Additionally, a Temporal cluster can be quite complicated to maintain, and, despite being open source, self-hosting may not be feasible for smaller organizations.

<h3 class="sh">Inngest</h3>

Inngest was born to manage reliable background jobs and event-driven workflows in modern serverless architectures. Like Temporal, it offers a cloud service that manages durable execution state, but it simplifies the developer experience significantly: developers write ordinary async functions and wrap side-effecting logic in built-in step primitives. The step results are memoized on the platform, so functions can be interrupted and resumed without needing a deterministic/non-deterministic code split.

While the source code for Inngest is available, and self-hosting Inngest is possible, the license for the source code is not exactly open source. This lack of clarity may deter developers and organizations who are looking to self-host their durable execution environment. Organizations with concerns about privacy and data compliance may also find issues with relying on a cloud service.

<div class="aslot">
<p class="atag">Placeholder · comparison table</p>
<p class="awhat">Open Source · Self Hosted · Dev Experience · Easy to set up</p>
<p class="ahint">[comparison table] from the draft</p>
</div>

While the market for durable execution has several strong solutions, these existing solutions leave a gap in the market. Smaller organizations who value self-hosting their own platforms due to cost or compliance concerns do not have a ready solution that combines good developer experience and simple, easy-to-maintain infrastructure with a truly open source durable execution engine.
