-- Create a function to send job status notifications
CREATE OR REPLACE FUNCTION public.notify_job_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  notification_title TEXT;
  notification_message TEXT;
  notification_type TEXT;
  notification_icon TEXT;
BEGIN
  -- Only trigger on status changes
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    -- Determine notification content based on new status
    CASE NEW.status
      WHEN 'In Progress' THEN
        notification_title := 'Job Started';
        notification_message := 'Your job "' || NEW.title || '" is now in progress.';
        notification_type := 'job_status';
        notification_icon := 'briefcase';
      WHEN 'Completed' THEN
        notification_title := 'Job Completed';
        notification_message := 'Your job "' || NEW.title || '" has been completed!';
        notification_type := 'job_completed';
        notification_icon := 'check-circle';
      WHEN 'Cancelled' THEN
        notification_title := 'Job Cancelled';
        notification_message := 'Your job "' || NEW.title || '" has been cancelled.';
        notification_type := 'job_status';
        notification_icon := 'x-circle';
      WHEN 'Pending' THEN
        notification_title := 'Job Pending';
        notification_message := 'Your job "' || NEW.title || '" is awaiting confirmation.';
        notification_type := 'job_status';
        notification_icon := 'clock';
      ELSE
        notification_title := 'Job Updated';
        notification_message := 'Your job "' || NEW.title || '" status changed to ' || NEW.status || '.';
        notification_type := 'job_status';
        notification_icon := 'briefcase';
    END CASE;

    -- Insert notification for the job owner
    INSERT INTO public.notifications (user_id, type, title, message, icon, time, unread)
    VALUES (NEW.user_id, notification_type, notification_title, notification_message, notification_icon, 'Just now', true);
  END IF;

  -- Also notify on payment status changes
  IF OLD.payment_status IS DISTINCT FROM NEW.payment_status AND NEW.payment_status IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, type, title, message, icon, time, unread)
    VALUES (
      NEW.user_id, 
      'payment', 
      'Payment ' || NEW.payment_status,
      'Payment for "' || NEW.title || '" is now ' || LOWER(NEW.payment_status) || '.',
      'credit-card',
      'Just now',
      true
    );
  END IF;

  -- Notify when offers are received
  IF OLD.offers_count IS DISTINCT FROM NEW.offers_count AND NEW.offers_count > COALESCE(OLD.offers_count, 0) THEN
    INSERT INTO public.notifications (user_id, type, title, message, icon, time, unread)
    VALUES (
      NEW.user_id, 
      'offer', 
      'New Quote Received',
      'You have a new quote for "' || NEW.title || '". You now have ' || NEW.offers_count || ' offer(s).',
      'file-text',
      'Just now',
      true
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger on jobs table for updates
DROP TRIGGER IF EXISTS trigger_job_status_notification ON public.jobs;
CREATE TRIGGER trigger_job_status_notification
  AFTER UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_job_status_change();

-- Also create trigger for new jobs
CREATE OR REPLACE FUNCTION public.notify_new_job()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, icon, time, unread)
  VALUES (
    NEW.user_id, 
    'job_status', 
    'Job Posted',
    'Your job "' || NEW.title || '" has been posted successfully.',
    'briefcase',
    'Just now',
    true
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_new_job_notification ON public.jobs;
CREATE TRIGGER trigger_new_job_notification
  AFTER INSERT ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_job();