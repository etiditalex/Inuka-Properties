-- Remove the visitor allow/disallow update-signal feature.
DROP TRIGGER IF EXISTS trg_notification_subscriptions_updated ON notification_subscriptions;
DROP TABLE IF EXISTS notification_subscriptions;
DROP TABLE IF EXISTS content_signals;
