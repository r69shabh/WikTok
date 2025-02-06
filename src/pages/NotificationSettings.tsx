import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Bell, MessageCircle, ThumbsUp, AtSign } from 'lucide-react';

interface NotificationSettings {
  reactions: boolean;
  replies: boolean;
  mentions: boolean;
}

export const NotificationSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<NotificationSettings>({
    reactions: true,
    replies: true,
    mentions: true
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('user_notification_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setSettings(data);
    }
  };

  const updateSetting = async (key: keyof NotificationSettings) => {
    if (!user) return;
    setIsSaving(true);

    try {
      const newSettings = {
        ...settings,
        [key]: !settings[key]
      };

      const { error } = await supabase
        .from('user_notification_settings')
        .upsert({
          user_id: user.id,
          ...newSettings
        });

      if (error) throw error;
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to update settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const SettingItem = ({ 
    title, 
    description, 
    icon: Icon, 
    enabled, 
    onChange 
  }: any) => (
    <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
      <div className="flex items-center gap-3">
        <Icon className={enabled ? 'text-blue-500' : 'text-gray-400'} />
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <button
        onClick={onChange}
        disabled={isSaving}
        className={`w-12 h-6 rounded-full transition-colors ${
          enabled ? 'bg-blue-500' : 'bg-gray-300'
        }`}
      >
        <span className={`block w-4 h-4 rounded-full bg-white transform transition-transform ${
          enabled ? 'translate-x-7' : 'translate-x-1'
        }`} />
      </button>
    </div>
  );

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-6">Notification Settings</h2>
      
      <SettingItem
        title="Reactions"
        description="When someone reacts to your comments"
        icon={ThumbsUp}
        enabled={settings.reactions}
        onChange={() => updateSetting('reactions')}
      />
      
      <SettingItem
        title="Replies"
        description="When someone replies to your comments"
        icon={MessageCircle}
        enabled={settings.replies}
        onChange={() => updateSetting('replies')}
      />
      
      <SettingItem
        title="Mentions"
        description="When someone mentions you in a comment"
        icon={AtSign}
        enabled={settings.mentions}
        onChange={() => updateSetting('mentions')}
      />
    </div>
  );
};