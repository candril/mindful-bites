import { useToken } from "@/components/AuthenticationContext";
import { Layout } from "@/components/Layout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useEntries } from "@/data/useStorage";
import { ChevronRight, Copy, Download, LogOut, Share } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const AboutPage = () => {
  const token = useToken();
  const [copied, setCopied] = useState<"token" | "link" | null>(null);
  const { entries } = useEntries();

  const handleCopyToken = () => {
    navigator.clipboard.writeText(token);
    setCopied("token");
    toast.success("Token copied to clipboard");
    setTimeout(() => setCopied(null), 2000);
  };

  const handleShareLink = () => {
    const url = `${window.location.origin}/${token}`;
    if (navigator.share) {
      navigator
        .share({
          title: "Mindful Bites Account Link",
          url: url,
        })
        .catch((err) => {
          console.error("Share failed:", err);
          handleCopyLink();
        });
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/${token}`;
    navigator.clipboard.writeText(link);
    setCopied("link");
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadCSV = () => {
    if (entries.length === 0) {
      toast.error("No data to download");
      return;
    }

    // Create CSV header
    const headers = [
      "Date",
      "Meal Type",
      "Health Rating",
      "Portion Size",
      "Components",
    ];
    const csvRows = [headers.join(",")];

    // Add entry rows
    entries.forEach((entry) => {
      const row = [
        new Date(entry.date).toISOString().split("T")[0],
        entry.data.mealType,
        entry.data.healthRating,
        entry.data.portionSize,
        `"${(entry.data.components as string[]).join(", ")}"`,
      ];
      csvRows.push(row.join(","));
    });

    // Create and download the file
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `mindful-bites-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout title="About">
      <div className="flex flex-col divide-y flex-1">
        <div className="py-2 px-4 bg-gray-50">
          <h2 className="text-sm font-medium text-gray-500">ACCOUNT</h2>
        </div>

        <div className="p-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span>Your User Token</span>
            <span className="text-sm text-gray-500 font-mono truncate max-w-70">
              {token}
            </span>
          </div>
          <Button
            variant="ghost"
            onClick={handleCopyToken}
            className="flex items-center"
          >
            {copied === "token" ? "Copied!" : <Copy size={18} />}
          </Button>
        </div>

        <div className="p-4 flex items-center justify-between">
          <span>Share Account Link</span>
          <Button
            variant="ghost"
            onClick={handleShareLink}
            className="flex items-center"
          >
            {copied === "link" ? "Copied!" : <Share size={18} />}
          </Button>
        </div>

        {/* Data section */}
        <div className="py-2 px-4 bg-gray-50">
          <h2 className="text-sm font-medium text-gray-500">DATA</h2>
        </div>

        <div className="p-4 flex items-center justify-between">
          <span>Export Data</span>
          <Button
            variant="ghost"
            onClick={downloadCSV}
            className="flex items-center"
          >
            <Download size={18} />
          </Button>
        </div>

        {/* About section */}
        <div className="py-2 px-4 bg-gray-50">
          <h2 className="text-sm font-medium text-gray-500">ABOUT</h2>
        </div>

        <a
          href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 flex items-center justify-between hover:bg-gray-100"
        >
          <span>Special Thanks</span>
          <ChevronRight size={18} className="text-gray-400" />
        </a>

        <div className="p-4 flex items-center justify-between">
          <span>Version</span>
          <span className="text-gray-500">{import.meta.env.APP_VERSION}</span>
        </div>
        <div className="mt-8">
          <div className="py-2 px-4 bg-red-50">
            <h2 className="text-sm font-medium text-red-500 uppercase">
              Danger Zone
            </h2>
          </div>
          <div className="overflow-hidden">
            <div className="bg-red-50 px-4 pb-3">
              <p className="text-sm">
                Warning: Logging out will remove all your data from this device.
                If you haven't saved your token, you won't be able to access
                your data again. Make sure you've written down or saved your
                token before proceeding.
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white flex border-0">
          <div className="ml-auto">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <LogOut size={16} className="mr-2" /> Logout
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove all your data from this device.
                    If you haven't saved your token, there will be no way to
                    recover your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      localStorage.clear();
                      window.location.href = "/";
                    }}
                  >
                    Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <div className="text-xs self-center flex-1 flex justify-items-center items-center text-gray-500">
          Made with ❤️ and quite some AI in Klein-Basel.
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
