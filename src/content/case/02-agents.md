---
id: "agents"
order: 2
num: "02"
label: "Agents"
screenLabel: "Agents"
title: "Agents"
---
<h3 class="sh">Cloud agents inherit distributed systems problems</h3>

The strongest argument for durable execution is not that agents are unpredictable by themselves. It is that production agents become distributed systems. They run across VMs, pods, APIs, databases, queues, model providers, and other services. Any one of those boundaries can fail while the agent is mid-task.

The practical shift is from local, supervised work to cloud, unattended work. A local coding agent can often fail safely because the developer is watching and conversation history preserves enough context to re-prompt. A cloud agent has to survive infrastructure failures without assuming a human is there to reconstruct what happened.

<h3 class="sh">Real world case study: Cursor adopting Temporal</h3>

Cursor's cloud agent work is a useful example. Their local coding agent experience did not require the same durable execution guarantees, but moving those agents into cloud infrastructure changed the reliability problem. Long-running tasks, VM crashes, pod replacement, and inference failures made workflow recovery part of the product surface.

The takeaway for Amber is the same: durable execution matters most when agents move from local processes into distributed production environments. Distribution increases failure probability, long-running work increases the cost of losing progress, and agent autonomy makes both harder to bound.

<div class="aslot">
<p class="atag">Placeholder · image</p>
<p class="awhat">[image of Cursor adopting Temporal]</p>
</div>

<a href="https://cursor.com/blog/cloud-agent-lessons">https://cursor.com/blog/cloud-agent-lessons</a>
