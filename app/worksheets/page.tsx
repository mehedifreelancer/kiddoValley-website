"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Search,
  FileText,
  Eye,
  Download,
  Loader2,
  AlertCircle,
} from "lucide-react";

import toast from "react-hot-toast";
import Button from "../components/shared/Button";
import Modal from "../components/shared/Modal";
import {
  getPublicWorksheets,
  getWorksheetDownloadUrl,
} from "./worksheet.service";
import { WorksheetItem } from "./worksheet.types";
import ListCardSkeleton from "../components/skeleton/ListCardSkeleton";
import ListingPageSkeleton from "../components/skeleton/ListingPageSkeleton";

// ---------- মূল পেজ ----------
export default function WorksheetsPage() {
  const [search, setSearch] = useState("");
  const [worksheets, setWorksheets] = useState<WorksheetItem[]>([]);
  const [loading, setLoading] = useState(true);
  // ✅ প্রথমবার mount হওয়ার loading vs পরের সার্চ loading আলাদা করার জন্য
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWorksheet, setSelectedWorksheet] =
    useState<WorksheetItem | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [page] = useState(1);
  const limit = 20;

  // reusable fetch — query সরাসরি প্যারামিটার হিসেবে নেয়,
  // কোনো intermediate state (debouncedSearch) এর উপর নির্ভর করে না
  const fetchWorksheets = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPublicWorksheets(page, limit, query);
      setWorksheets(response.data || []);
    } catch (err: any) {
      setError(err.message || "কিছু একটা ভুল হয়েছে");
    } finally {
      setLoading(false);
      // প্রথম fetch শেষ হওয়ার পর থেকে আর initial load ধরা হবে না
      setIsInitialLoad(false);
    }
  };

  // প্রথমবার mount হলে সব ওয়ার্কশীট আনবে (খালি সার্চ দিয়ে)
  useEffect(() => {
    fetchWorksheets("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Preview handler – browser এ inline দেখাবে (এখানে download হবে না, শুধু view)
  const handlePreview = (worksheet: WorksheetItem) => {
    setSelectedWorksheet(worksheet);
    setPreviewModalOpen(true);
  };

  // ✅ Download handler – সরাসরি ফাইল ডাউনলোড হবে (Content-Disposition header দিয়ে)
  const handleDownload = (worksheet: WorksheetItem) => {
    try {
      setDownloadingId(worksheet.id);
      const downloadUrl = getWorksheetDownloadUrl(worksheet.id);
      // navigation দিয়ে হিট করলে backend header অনুযায়ী browser download শুরু করবে
      window.location.href = downloadUrl;
    } catch (err) {
      toast.error("ডাউনলোড ব্যর্থ");
    } finally {
      // navigation asynchronous, তাই সামান্য delay দিয়ে loading state reset করা হচ্ছে
      setTimeout(() => setDownloadingId(null), 1500);
      toast.success("ডাউনলোড হয়েছে !");
    }
  };

  // সার্চ ফর্ম সাবমিট — এখানেই একমাত্র জায়গা যেখান থেকে সার্চ API কল হবে
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWorksheets(search);
  };

  // ✅ প্রথম লোডে পুরো পেজ (heading + form + list) skeleton দেখাবে
  if (isInitialLoad && loading) {
    return (
      <div className="relative min-h-screen overflow-hidden px-4 py-8 sm:py-12">
        <div className="fixed inset-0 bg-gradient-to-br from-[#E57373]/10 via-[#BA68C8]/10 to-[#9575CD]/10 dark:from-[#E57373]/5 dark:via-[#BA68C8]/5 dark:to-[#9575CD]/5 backdrop-blur-xl -z-10" />
        <ListingPageSkeleton itemCount={5} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8 sm:py-12">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#E57373]/10 via-[#BA68C8]/10 to-[#9575CD]/10 dark:from-[#E57373]/5 dark:via-[#BA68C8]/5 dark:to-[#9575CD]/5 backdrop-blur-xl -z-10" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-light text-stone-800 dark:text-stone-200">
            ফ্রী ওয়ার্কশীট লাইব্রেরি
          </h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            শিক্ষামূলক প্রিন্ট রেডি পিডিএফ এক ক্লিকে ডাউনলোড করুন প্রিন্ট করুন ।
            সোনামনিকে কে দিন নতুন চ্যালেঞ্জ প্রতিদিন !
          </p>
        </div>

        {/* Search Form */}
        <form
          onSubmit={handleSearchSubmit}
          className="backdrop-blur-xl bg-white/20 dark:bg-black/30 rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/30 dark:border-white/10"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ওয়ার্কশীট খুঁজুন (টাইটেল)"
                className="w-full px-4 py-3 rounded-xl border border-white/30 dark:border-white/20 bg-white/20 dark:bg-black/30 backdrop-blur-md text-stone-800 dark:text-stone-200 placeholder-stone-500/70 focus:outline-none focus:ring-2 focus:ring-[#BA68C8]/50 focus:border-transparent transition-all"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              disabled={loading}
              className="px-8 py-3 text-sm sm:text-base mt-1 sm:mt-0"
            >
              <Search className="w-5 h-5 mr-2" />
              খুঁজুন
            </Button>
          </div>
        </form>

        {/* Results */}
        {loading ? (
          // ✅ সার্চ করার সময় শুধু লিস্ট অংশ skeleton হবে, form/heading থাকবে
          <ListCardSkeleton count={5} />
        ) : error ? (
          <div className="text-center py-12 text-red-500 dark:text-red-400">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">{error}</p>
          </div>
        ) : worksheets.length > 0 ? (
          <div className="mt-8 space-y-4">
            {worksheets.map((worksheet, idx) => (
              <motion.div
                key={worksheet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="backdrop-blur-xl bg-white/20 dark:bg-black/30 rounded-2xl shadow-lg p-5 sm:p-6 border border-white/30 dark:border-white/10 hover:shadow-xl transition-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="flex-1 flex items-center gap-3">
                  <FileText className="w-6 h-6 text-[#BA68C8] flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-medium text-stone-800 dark:text-stone-200">
                      {worksheet.title}
                    </h3>
                    <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">
                      {new Date(worksheet.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handlePreview(worksheet)}
                    className="flex-1 sm:flex-none"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    ওয়ার্কশীট দেখুন
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(worksheet)}
                    disabled={downloadingId === worksheet.id}
                    className="flex-1 sm:flex-none"
                  >
                    {downloadingId === worksheet.id ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-1" />
                    )}
                    ডাউনলোড
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-stone-500 dark:text-stone-400">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">কোনো ওয়ার্কশীট পাওয়া যায়নি</p>
            <div className="flex justify-center">
              <Button
                size="sm"
                onClick={() => {
                  setSearch("");
                  fetchWorksheets("");
                }}
                className="mt-4"
              >
                ঠিকাছে ফিরে যাই
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal – এখানে এখনো inline iframe view, ফাইলের নিজস্ব URL ব্যবহার করছে */}
      <Modal
        isOpen={previewModalOpen}
        onClose={() => {
          setPreviewModalOpen(false);
          setSelectedWorksheet(null);
        }}
        title={selectedWorksheet?.title || "প্রিভিউ"}
        size="lg"
        disableScrollLock
      >
        {selectedWorksheet && (
          <div className="h-[70vh]">
            <iframe
              src={selectedWorksheet.filePath}
              className="w-full h-full border-0 rounded-lg"
              title={selectedWorksheet.title}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
