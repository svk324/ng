// File: src/components/ui/AddStudentForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AddStudentForm({ courseId }: { courseId: string }) {
  const [studentEmail, setStudentEmail] = useState("");
  const [certificateUrl, setCertificateUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("/api/students/access", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentEmail,
        courseId,
        certificateUrl,
      }),
    });

    setStudentEmail("");
    setCertificateUrl("");
    // Optionally refresh the page or update the UI
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Student Email"
        value={studentEmail}
        onChange={(e) => setStudentEmail(e.target.value)}
        required
      />
      <Input
        placeholder="Certificate URL (optional)"
        value={certificateUrl}
        onChange={(e) => setCertificateUrl(e.target.value)}
      />
      <Button type="submit">Add Student</Button>
    </form>
  );
}
