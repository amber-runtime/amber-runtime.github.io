---
id: "future"
order: 6
num: "06"
label: "Future Work"
screenLabel: "Future Work"
title: "Future Work"
---
<h3 class="sh" id="versioning">Versioning</h3>

Currently, Amber does not handle versioning when the developers update their code while there are still pending or enqueued workflows. As a result, workflows left in the queue after a deployment will execute using the updated codebase rather than the version they were originally created with. This can create compatibility issues between releases of the developer's application.

As an intermediate solution, Amber allows developers to manually remove pending or enqueued workflows before deploying new code. However, this is a destructive action and cannot be reversed, so developers must use it with caution.

In future releases, Amber will support workflow versioning. Older workflows will continue to be executed against the code version they were created with, while newly created workflows will run using the updated codebase. This will allow deployments to be safer and reduce the risk of workflow failures caused by incompatible code changes.


<h3 class="sh" id="skills-for-agents">Better Support for Agents</h3>

Amber currently provides limited controls for how agents retrieve workflow information through the CLI. While agents can query workflows via the CLI command `workflows`, agents will not always adhere to using that path when trying to get workflow information. In some cases, this can result in agents attempting to directly access your database to retrieve workflow data.

In the future, Amber will introduce dedicated skill files to better constrain agent behavior and guide agents toward approved methods to retrieve workflow data. This will improve the user experience and reduce the risk of unintended actions by agents when retrieving workflow information.


<h3 class="sh" id="support-for-other-agent-frameworks">Support for Other Agent Frameworks</h3>

Amber only supports the OpenAI Agents SDK. This decision allowed us to focus on building Amber and not managing the additional complexity of adding different agent frameworks.

In the future, we plan to expand support for additional agent frameworks. This will give developers more flexibility in how they build their agents and allow Amber to be framework agnostic.

