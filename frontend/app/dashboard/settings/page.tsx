"use client";
import React, { useEffect, useState } from "react";
import { AlertConfig } from "@/components/AlertConfig";
import { getSettings, updateSettings } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Bell, Shield, Key } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleUpdate = async (newSettings: any) => {
    try {
      await updateSettings(newSettings);
      setSettings((prev: any) => ({ ...prev, ...newSettings }));
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <div>Loading settings...</div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-heading font-bold">Preferences</h2>
        <p className="text-[#94A3B8]">Manage your automation defaults and notification channels.</p>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="bg-[#111118] border-[#1E1E2E]">
          <TabsTrigger value="notifications" className="gap-2 data-[state=active]:bg-[#6366F1]"><Bell className="w-4 h-4" /> Notifications</TabsTrigger>
          <TabsTrigger value="general" className="gap-2 data-[state=active]:bg-[#6366F1]"><Settings className="w-4 h-4" /> General</TabsTrigger>
          <TabsTrigger value="security" className="gap-2 data-[state=active]:bg-[#6366F1]"><Shield className="w-4 h-4" /> Security</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <AlertConfig settings={settings} onUpdate={handleUpdate} />
        </TabsContent>

        <TabsContent value="general">
          <Card className="bg-[#111118] border-[#1E1E2E]">
            <CardHeader>
              <CardTitle>Global Automation Defaults</CardTitle>
              <CardDescription>Configure default mission parameters for new agents.</CardDescription>
            </CardHeader>
            <CardContent className="h-40 flex items-center justify-center text-[#94A3B8] opacity-20">
              <Settings className="w-12 h-12" />
              General settings coming soon...
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="bg-[#111118] border-[#1E1E2E]">
            <CardHeader>
              <CardTitle>Access & API Keys</CardTitle>
              <CardDescription>Manage your omnix API keys and session preferences.</CardDescription>
            </CardHeader>
            <CardContent className="h-40 flex items-center justify-center text-[#94A3B8] opacity-20">
              <Key className="w-12 h-12" />
              Security keys coming soon...
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
