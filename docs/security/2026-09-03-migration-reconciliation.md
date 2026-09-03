<!-- docs/security/2026-09-03-migration-reconciliation.md -->
# Migration reconciliation — September 3, 2026

Project: `9takes` (`nhjjzcsnmyotyhykbajc`). Checked after the production security rollout at 23:08 UTC.

All **30 local migrations with a 14-digit timestamp** now match the version and name recorded in Supabase. The remote history contains 45 entries, including remote-only wargames migrations. The three security migrations created during this audit are applied.

The folder also contains **79 legacy date-only files and four undated bootstrap/data scripts**. These are historical inputs, not a reliable queue of pending production changes. Several date-only versions are duplicated. Some scripts replace function definitions or permissions that later migrations deliberately supersede; others delete old rows, seed fixed IDs, or overwrite article/email copy.

## Evidence and limits

- Compared table, function, view, and materialized-view creation targets with the live catalogs: every referenced target exists. The two objects in the `private` schema were checked separately and also exist.
- Compared all 80 extracted `ADD COLUMN` references with live table columns: none are missing.
- Object existence establishes that schema work is represented; it does **not** establish that every historical statement was executed verbatim or that old seed data should be replayed.
- Existing remote history was preserved. No fabricated “applied” records were inserted for unrecorded historical files.
- Historical content seeds, cleanup deletes, and obsolete grants were not replayed. Any required future adjustment should be a new forward migration against the current schema.
- Do not run `db push --include-all` against this mixed-history folder. Reconcile or baseline legacy history as a separate maintenance change before introducing automatic migration deployment.

## Current timestamped migrations

| Local file                                                              | Remote status              |
| ----------------------------------------------------------------------- | -------------------------- |
| `20260812010000_schedule_analytics_maintenance.sql`                     | Recorded: `20260812010000` |
| `20260812010100_optimize_blog_typeahead.sql`                            | Recorded: `20260812010100` |
| `20260812010200_optimize_trending_pages_planning.sql`                   | Recorded: `20260812010200` |
| `20260812010300_add_telemetry_cleanup_fk_indexes.sql`                   | Recorded: `20260812010300` |
| `20260812010400_optimize_release_performance_raw_windows.sql`           | Recorded: `20260812010400` |
| `20260812010500_materialize_release_demand_source_buckets.sql`          | Recorded: `20260812010500` |
| `20260812010600_optimize_visitors_last_30_days.sql`                     | Recorded: `20260812010600` |
| `20260812010700_optimize_analytics_duration_late_metrics.sql`           | Recorded: `20260812010700` |
| `20260812010800_optimize_top_pages_timeseries.sql`                      | Recorded: `20260812010800` |
| `20260812010900_enneagram_type_prompt_campaign.sql`                     | Recorded: `20260812010900` |
| `20260812234500_comment_reply_subscriptions.sql`                        | Recorded: `20260812234500` |
| `20260812235500_reply_notification_outbox.sql`                          | Recorded: `20260812235500` |
| `20260813014408_reply_notification_delivery_and_return.sql`             | Recorded: `20260813014408` |
| `20260813030000_question_feature_runs.sql`                              | Recorded: `20260813030000` |
| `20260813203000_question_editorial_audit.sql`                           | Recorded: `20260813203000` |
| `20260813213000_quarantine_failed_question_rewrites.sql`                | Recorded: `20260813213000` |
| `20260821153811_enforce_homepage_chorus_readiness.sql`                  | Recorded: `20260821153811` |
| `20260824193611_persist_strategic_question_self_reported_type.sql`      | Recorded: `20260824193611` |
| `20260824193712_retain_welcome_sequence_contributors.sql`               | Recorded: `20260824193712` |
| `20260824204743_include_recorded_hard_bounces_in_email_suppression.sql` | Recorded: `20260824204743` |
| `20260824205037_restrict_email_suppression_rpc_to_service_role.sql`     | Recorded: `20260824205037` |
| `20260824210814_sync_enneagram_prompt_pilot_copy.sql`                   | Recorded: `20260824210814` |
| `20260827044724_optimize_trending_baseline_range.sql`                   | Recorded: `20260827044724` |
| `20260827044736_cache_release_performance.sql`                          | Recorded: `20260827044736` |
| `20260827044845_cleanup_duplicate_indexes_and_rls.sql`                  | Recorded: `20260827044845` |
| `20260901200535_p0_email_compliance_security.sql`                       | Recorded: `20260901200535` |
| `20260901200536_p1_email_delivery_tracking_scheduler.sql`               | Recorded: `20260901200536` |
| `20260903211149_security_access_controls.sql`                           | Recorded: `20260903211149` |
| `20260903230508_security_rls_storage_rpc.sql`                           | Recorded: `20260903230508` |
| `20260903230720_security_remaining_function_search_path.sql`            | Recorded: `20260903230720` |

## Legacy dated files

“Catalog targets present” means the file's extracted creation targets exist; exact historical data effects are not asserted. “No creation target” means the file consists of alterations, data changes, grants, or other operations; applicable added columns were included in the comparison above.

| Local file                                                | Recorded by name | Catalog comparison      |
| --------------------------------------------------------- | ---------------- | ----------------------- |
| `20250719_add_comment_count_column.sql`                   | No               | Catalog targets present |
| `20250719_optimize_questions_page.sql`                    | No               | Catalog targets present |
| `20250911_add_blogs_famous_people_history.sql`            | No               | Catalog targets present |
| `20250916_add_performance_indexes_priority1.sql`          | No               | No creation target      |
| `20250916_add_performance_indexes_priority2_3.sql`        | No               | No creation target      |
| `20250916_test_schema_compatibility.sql`                  | No               | No creation target      |
| `20251201_comment_improvements.sql`                       | No               | Catalog targets present |
| `20251202_email_management_system.sql`                    | No               | Catalog targets present |
| `20251204_blog_search_system.sql`                         | No               | Catalog targets present |
| `20251204_blog_typeahead_search.sql`                      | No               | Catalog targets present |
| `20251204_consulting_management_system.sql`               | No               | Catalog targets present |
| `20251204_consulting_rls_policies.sql`                    | No               | Catalog targets present |
| `20251204_fix_consulting_rls.sql`                         | No               | No creation target      |
| `20251204_pg_cron_scheduled_emails.sql`                   | No               | Catalog targets present |
| `20251212_add_session_goal_to_coaching_waitlist.sql`      | No               | Catalog targets present |
| `20260117_add_persona_title_column.sql`                   | No               | No creation target      |
| `20260118_add_persona_titles.sql`                         | No               | No creation target      |
| `20260121_email_tracking_analytics_updates.sql`           | No               | Catalog targets present |
| `20260220_site_page_analytics.sql`                        | No               | Catalog targets present |
| `20260223_admin_analytics_page_trend_and_sort.sql`        | No               | Catalog targets present |
| `20260223_admin_analytics_top_pages.sql`                  | No               | Catalog targets present |
| `20260302_admin_analytics_pages_sorted_windowed.sql`      | No               | Catalog targets present |
| `20260304_email_suppression_helpers.sql`                  | No               | Catalog targets present |
| `20260316_welcome_email_sequence.sql`                     | No               | Catalog targets present |
| `20260318_content_access_events.sql`                      | No               | Catalog targets present |
| `20260318_content_access_events_lockdown.sql`             | No               | No creation target      |
| `20260328_reduce_self_generated_usage.sql`                | No               | Catalog targets present |
| `20260328_shrink_blog_history.sql`                        | No               | Catalog targets present |
| `20260329_add_app_error_events.sql`                       | No               | Catalog targets present |
| `20260329_question_category_intro_content.sql`            | No               | Catalog targets present |
| `20260401_fix_blogs_famous_people_history_signature.sql`  | No               | Catalog targets present |
| `20260403_update_welcome_email_2.sql`                     | No               | No creation target      |
| `20260406_claim_specific_sequence_send.sql`               | No               | Catalog targets present |
| `20260407_question_category_slugs.sql`                    | No               | Catalog targets present |
| `20260408_blog_search_indexing_hardening.sql`             | No               | Catalog targets present |
| `20260408_fix_search_rpc_bigint_signatures.sql`           | No               | Catalog targets present |
| `20260408_grant_attach_signup_first_touch_to_anon.sql`    | No               | No creation target      |
| `20260408_question_full_search.sql`                       | No               | Catalog targets present |
| `20260408_question_search_system.sql`                     | No               | Catalog targets present |
| `20260408_retention_first_touch_capture.sql`              | No               | Catalog targets present |
| `20260409_auth_security_events.sql`                       | No               | Catalog targets present |
| `20260412_content_release_analytics.sql`                  | No               | Catalog targets present |
| `20260412_z_content_analytics_daily_rollups.sql`          | No               | Catalog targets present |
| `20260412_zz_content_release_event_impact.sql`            | No               | Catalog targets present |
| `20260413_content_release_benchmarks.sql`                 | No               | Catalog targets present |
| `20260417_canonicalize_personality_analytics_paths.sql`   | No               | Catalog targets present |
| `20260417_fix_release_analytics_freshness.sql`            | No               | No creation target      |
| `20260418_admin_dashboard_performance.sql`                | No               | Catalog targets present |
| `20260418_backfill_people_release_events.sql`             | No               | No creation target      |
| `20260420_blogs_famous_people_jsonld_fields.sql`          | No               | No creation target      |
| `20260421_reactivation_email_sequence.sql`                | No               | Catalog targets present |
| `20260430_harden_page_analytics_visit_rpc.sql`            | No               | Catalog targets present |
| `20260508_related_blogs_for_question.sql`                 | No               | Catalog targets present |
| `20260513_align_retention_rpcs_with_ui.sql`               | No               | Catalog targets present |
| `20260513_harden_question_comment_identity.sql`           | No               | Catalog targets present |
| `20260513_search_typeahead_performance.sql`               | No               | Catalog targets present |
| `20260514_admin_analytics_trending_pages.sql`             | No               | Catalog targets present |
| `20260514_ai_acquisition_sources.sql`                     | No               | Catalog targets present |
| `20260515_fix_release_performance_benchmarks.sql`         | No               | Catalog targets present |
| `20260529_backfill_acquisition_source.sql`                | No               | No creation target      |
| `20260529_release_demand_metrics_rpc.sql`                 | No               | Catalog targets present |
| `20260613_give_first_funnel_events.sql`                   | No               | Catalog targets present |
| `20260615_chorus.sql`                                     | No               | Catalog targets present |
| `20260619_newsletter_signup_security_events.sql`          | No               | Catalog targets present |
| `20260625_fix_content_access_telemetry_timeout.sql`       | No               | Catalog targets present |
| `20260626_remove_telemetry_maintenance_from_hot_path.sql` | No               | Catalog targets present |
| `20260703_admin_consulting_dashboard_summary.sql`         | No               | Catalog targets present |
| `20260709_admin_question_category_rollup.sql`             | No               | Catalog targets present |
| `20260709_admin_user_status_safety.sql`                   | No               | Catalog targets present |
| `20260709_admin_users_page.sql`                           | No               | Catalog targets present |
| `20260709_email_sequence_send_identity.sql`               | No               | Catalog targets present |
| `20260709_reactivation_candidate_summary.sql`             | No               | Catalog targets present |
| `20260714_align_demo_moderation_columns.sql`              | No               | No creation target      |
| `20260718_harden_people_content_update.sql`               | No               | Catalog targets present |
| `20260719_fix_admin_users_page_external_id.sql`           | No               | Catalog targets present |
| `20260725_api_rate_limit_events.sql`                      | No               | Catalog targets present |
| `20260725_notifications.sql`                              | No               | Catalog targets present |
| `20260804_optimize_release_analytics_slug_lookup.sql`     | Yes              | No creation target      |
| `20260812_comment_analytics_context.sql`                  | Yes              | Catalog targets present |

## Undated scripts retained as history

| File                                   | Reason not replayed                                                                |
| -------------------------------------- | ---------------------------------------------------------------------------------- |
| `create_tables.sql`                    | Legacy bootstrap tables and fixed-ID category seeds; schema already exists.        |
| `insert.sql`                           | Legacy tag seed inserts; not a versioned forward migration.                        |
| `migration-for-new-people.sql`         | Historical article INSERTs; replay can duplicate or conflict with current content. |
| `migration-for-unpublished-people.sql` | Historical article metadata updates; replay can overwrite newer editorial work.    |
