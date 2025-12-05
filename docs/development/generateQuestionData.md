<!-- docs/generateQuestionData.md -->

[TYPE] = 4
[QUESTION] = 'What would you change about yourself if you could?'

I need to generate data. The data will be comments on questions. And the comments will all be from an Enneagram type [TYPE]. And the question is [QUESTION]

Vary up the comments. Consider how an Enneagram type [TYPE] would answer and approach the question. Consider varying responses depending on the different wings an [TYPE] would have. Also vary the responses considering the different instinctual subtypes, Self-Preservation, Social or One-to-One. You should also vary the responses by race and gender and age and social status, but do not overtly mention any of these factors.

[QUESTIONID] = 16

You will then create SQL statements inserting the comments.
Generate a comment for each of these userIds:

| id                                   |
| ------------------------------------ |
| b2a27534-4c0a-4b96-b6b0-2d2243b172f3 |
| abbb19c7-47f6-4857-bea2-53de4bad4aea |
| 5a6c7672-d15e-481b-a0cf-844b54eb4cf8 |
| 17f8c677-2b47-43c7-a481-390befd73d5a |
| 2a65d9a4-34a3-4947-a2ed-6f45168908cb |
| 87aa1e4e-43bf-4c0b-858a-6c5004df56eb |
| 3eafd318-6fef-43e1-bd97-21d35fd02fa6 |
| 9494773c-ce8b-47a4-b548-836d3a06d0d6 |
| fdefb960-9bf6-4ced-9c9f-c9e00a8e64e4 |
| d5bff257-9cd2-452c-aab5-8c2407c618ca |
| a9a6f4f8-e65b-489f-b86e-0a80724177c9 |
| c677574b-6d12-47c5-ab5c-78cedf48a696 |
| 7a62cea8-57dd-4b86-893c-abe7ceddc828 |
| cc40b84b-78ce-4683-995d-680fe7a654d1 |
| fefaee52-79a0-4496-bbea-0263ebfc0247 |
| dbfa8e8e-d068-4d62-8345-07d23837bc2c |
| 90a71695-bde9-4601-8eee-985ab9aae6ea |
| 97590291-cc5c-4b3b-adbe-8e53a100fef8 |
| fa079668-ca3b-4f70-92d7-132c1eed485a |
| 596823ac-4f36-40ae-a5e7-f38d92331605 |
| 7ba742dc-db6b-49e7-98a7-c6afaa6f5c70 |
| c8f11444-73b3-47f6-85d9-0cb89336b71d |
| 12479a45-f765-40ea-9d74-611d47acf174 |
| fffa58f2-d113-45a0-8616-d60e8e3cce8b |
| f745393a-1ebf-4c3b-97a8-0ece6c8df767 |
| 01083c71-0f93-4f4d-aaae-30cb775dcde4 |
| a2e80fb5-1f18-4507-a837-b65abbc97a08 |
| b2427eef-d7fe-4796-b464-03f1b34c9678 |
| 5445956f-9c97-4588-b356-3b8b1b2952fe |
| 01261f92-2201-4a17-97af-2199e4189dc7 |

The format will be like this:
insert into
comments_demo (
comment,
parent_id,
author_id,
parent_type
)
values
(
[the generated comment],
[QUESTIONID],
[userId],
'question'
)

for example:

insert into
comments_demo (
comment,
parent_id,
author_id,
parent_type
)
values
(
'I''d like to better balance my personal life with my ambition. Work isn''t everything.',
16,
'd44ccb66-28d4-48bf-b796-ed185a76b670',
'question'
);
