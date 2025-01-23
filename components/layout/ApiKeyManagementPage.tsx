/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { Plus, Copy, KeyRound } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
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
    const [newKeyName, setNewKeyName] = useState("");
    const [usageLimit, setUsageLimit] = useState("1000");
    // const { toast } = useToast();
    const { getToken } = useAuth();

    const fetchKeys = async () => {
        try {
            const token = await getToken();
            const response = await fetch("/api/v1/keys", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Failed to fetch keys");
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
            const token = await getToken();
            const response = await fetch("/api/v1/keys", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: newKeyName,
                    usageLimit: parseInt(usageLimit),
                }),
            });

            if (!response.ok) throw new Error("Failed to create key");
            const newKey = await response.json();

            setApiKeys([...apiKeys, newKey]);
            setNewKeyName("");
            setUsageLimit("1000");

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
                <div className='flex gap-4'>
                    <Input
                        placeholder='Key name'
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        className='flex-1'
                    />
                    <Input
                        type='number'
                        placeholder='Usage limit'
                        value={usageLimit}
                        onChange={(e) => setUsageLimit(e.target.value)}
                        className='w-32'
                    />
                    <Button
                        onClick={createNewKey}
                        disabled={creating || !newKeyName}>
                        <Plus className='w-4 h-4 mr-2' />
                        Create Key
                    </Button>
                </div>

                <div className='space-y-4'>
                    {apiKeys.map((key) => (
                        <div
                            key={key.id}
                            className='p-4 border rounded-lg space-y-3'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <h3 className='font-medium'>{key.name}</h3>
                                    <p className='text-sm text-gray-500'>
                                        Created {formatDate(key.createdAt)}
                                        {key.lastUsed &&
                                            ` • Last used ${formatDate(
                                                key.lastUsed
                                            )}`}
                                    </p>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <span className='text-sm text-gray-500'>
                                        Usage: {key.usageLimit.toLocaleString()}{" "}
                                        requests/month
                                    </span>
                                    <Button
                                        variant='ghost'
                                        size='sm'
                                        onClick={() => copyKey(key.id)}>
                                        <Copy className='w-4 h-4' />
                                    </Button>
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
