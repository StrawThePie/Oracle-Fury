export default function SettingsScreen() {
  return (
    <div className="flex-1 p-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-6 max-w-2xl">
        <div className="bg-card p-6 rounded-lg border border-border">
          <h2 className="text-lg font-semibold mb-4">Game Settings</h2>
          <p className="text-muted-foreground">Settings panel coming soon...</p>
        </div>
        
        <div className="bg-card p-6 rounded-lg border border-border">
          <h2 className="text-lg font-semibold mb-4">Display Settings</h2>
          <p className="text-muted-foreground">Display options coming soon...</p>
        </div>
      </div>
    </div>
  );
}