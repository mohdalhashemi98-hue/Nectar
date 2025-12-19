interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

const EmptyState = ({ icon, title, message, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-fade-in">
    <div className="text-6xl mb-4 animate-bounce-subtle">{icon}</div>
    <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground mb-6">{message}</p>
    {action && (
      <button
        onClick={action.onPress}
        className="btn-primary"
      >
        {action.label}
      </button>
    )}
  </div>
);

export default EmptyState;
