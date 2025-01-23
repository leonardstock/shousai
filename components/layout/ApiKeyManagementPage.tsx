/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { Plus, Copy, KeyRound } from "lucide-react";
// import { useToast } from "@/components/ui/use-toast";
import { Input } from "../shared/Input";
import { Button } from "../shared/Button";

type ApiKey = {
    id: string;
    name: string;
    createdAt: string;
    lastUsed: string | null;
    enabled: boolean;
    usageLimit: number;
};

const ApiKeysPage = () => {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [newKeyName, setNewKeyName] = useState("test");
    const [usageLimit, setUsageLimit] = useState("1");

    const fetchKeys = async () => {
        try {
            const response = await fetch("/api/v1/keys");

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error response:", errorText);
                throw new Error(`Failed to fetch keys: ${response.status}`);
            }

            const data = await response.json();

            setApiKeys(data);
        } catch (error) {
            // toast({
            //     title: "Error fetching API keys",
            //     description: "Please try again later",
            //     variant: "destructive",
            // });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKeys();
    }, []);

    const createNewKey = async () => {
        if (!newKeyName) return;
        setCreating(true);
        try {
            const response = await fetch("/api/v1/keys", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: newKeyName,
                }),
            });

            if (!response.ok) throw new Error("Failed to create key");

            fetchKeys();

            // toast({
            //     title: "API Key Created",
            //     description: "Your new API key has been created successfully",
            // });
        } catch (error) {
            // toast({
            //     title: "Error creating API key",
            //     description: "Please try again later",
            //     variant: "destructive",
            // });
        } finally {
            setCreating(false);
        }
    };

    const copyKey = async (key: string) => {
        await navigator.clipboard.writeText(key);
        // toast({
        //     title: "Copied!",
        //     description: "API key copied to clipboard",
        // });
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <div className='p-6'>
                <div className='h-24 animate-pulse bg-gray-200 rounded-lg' />
            </div>
        );
    }

    return (
        <div className='p-6 max-w-4xl mx-auto space-y-6'>
            <div className='flex items-center gap-2 mb-6'>
                <KeyRound className='w-6 h-6' />
                <h2 className='text-2xl font-semibold'>API Keys</h2>
            </div>

            <div className='space-y-4'>
                {apiKeys.length === 0 && (
                    <div className='flex gap-4'>
                        <Input
                            placeholder='Key name'
                            value={newKeyName}
                            onChange={(e) => setNewKeyName(e.target.value)}
                            className='flex-1'
                        />
                        <Button
                            onClick={createNewKey}
                            disabled={creating || !newKeyName}>
                            <Plus className='w-4 h-4 mr-2' />
                            Create Key
                        </Button>
                    </div>
                )}

                <div className='space-y-4'>
                    {apiKeys.map((key) => (
                        <div
                            key={key.id}
                            className='p-4 border rounded-lg space-y-3'>
                            <div className='flex items-center justify-between'>
                                <h3 className='font-medium'>{key.name}</h3>
                                <div className='flex flex-col items-end gap-2'>
                                    <p className='text-sm text-gray-500'>
                                        Created: {formatDate(key.createdAt)}
                                    </p>
                                    <p className='text-sm text-gray-500'>
                                        {key.lastUsed &&
                                            `Last used: ${formatDate(
                                                key.lastUsed
                                            )}`}
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-center justify-between'>
                                <code className='block p-2 bg-gray-100 rounded text-sm flex-1'>
                                    {key.id}
                                </code>
                                <div className='ml-4'>
                                    {key.enabled ? (
                                        <span className='text-green-500 text-sm'>
                                            Active
                                        </span>
                                    ) : (
                                        <span className='text-red-500 text-sm'>
                                            Disabled
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {apiKeys.length === 0 && (
                        <div className='text-center py-12 text-gray-500'>
                            No API keys yet. Create one to get started.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApiKeysPage;
