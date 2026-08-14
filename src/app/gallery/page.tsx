"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PhotoIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import { adminService, AdminGalleryImage } from "@/services/local-api";

// ── Static Asset Arrays ───────────────────────────────────────────────────────
const galleryImages = [
  "/Team.jpg",
  "/images/Team.jpg",
  "/images/Team_final.jpg",
  "/images/hero_final.jpg",
  "/images/5e37c5fa-e94f-423c-af6d-cd398e215bf5.JPG",
  "/images/6fb202aa-ef99-48ed-ba2b-1646c9c317c1.JPG",
  "/images/DSC_0001.jpg",
  "/images/DSC_0002.jpg",
  "/images/DSC_0003.jpg",
  "/images/DSC_0006.jpg",
  "/images/DSC_0007.jpg",
  "/images/DSC_0008.jpg",
  "/images/DSC_0009.jpg",
  "/images/DSC_0010.jpg",
  "/images/DSC_0011.jpg",
  "/images/DSC_0012.jpg",
  "/images/DSC_0013.jpg",
  "/images/DSC_0014.jpg",
  "/images/z5973016052782_001_d51bdad3cd2ed2e981bc093e51fc3903.jpg",
  "/images/z5973016052782_002_273b5235652a3dfb76bf40d8a50b698c.jpg",
  "/images/z5973016052782_003_cc79159abbb5a68bf4d33000377f0dde.jpg",
  "/images/z5973016052782_004_5c4d60c05ca5bbad90105f448b75663f.jpg",
  "/images/z5973016052782_005_4ca298975090cb17a3c98db94c3bfd5f.jpg",
  "/images/z5973016052782_006_4a3d9155df36aaa0a0f46ea87b287929.jpg",
  "/images/z5973016052782_007_f9a2923635343ebbc23dfa1b20d2b06b.jpg",
  "/images/z5973016052782_008_1f51f84119fa442f24763bcdca13d68e.jpg",
  "/images/z5973016052782_009_086b948f1e03d07304db4233e6fa3a48.jpg",
  "/images/z5973016052782_010_7ed90876f2e0c1394b4810a0ceb81307.jpg",
  "/images/z5973016052782_011_8c9e48650bcebc0ace8232f11e9bc7e8.jpg",
  "/images/z5973016052782_012_347af6f41ce9410bb3ccdcd33a13bb75.jpg",
  "/images/z5973016052782_013_5ea124340516ab9f428c2f369e3de63f.jpg",
  "/images/z5973016052782_014_c27408425d9e17f84c64ea41ac2f375f.jpg",
  "/images/z5973016052782_015_1b8201f1cc99484d73796856439bcf67.jpg",
  "/images/z5973016052782_016_adb8d5814856736c7e4acdede2bb606d.jpg",
  "/images/z5973016052782_017_d38214a28aa2e76748f4211340e3dc41.jpg",
  "/images/z5973016052782_018_d84f316aa147fc673d990a0cbb76a26d.jpg",
  "/images/z5973016052782_019_faa191f96924fd80d011004581c35c62.jpg",
  "/images/z5973016052782_020_04a7f35c28e027ba3ed4f63adfad54fd.jpg",
  "/images/z5973016052782_021_08352a116dcbc570b8e02e43c1be2aa5.jpg",
  "/images/z5973016052782_022_3faa2c9433a16cd2663f241b4a17efe7.jpg",
  "/images/z5973016052782_023_2f600f5f1e257b02427476751201de5b.jpg",
  "/images/z5973016052782_024_903cfe4ad96e0f3ec3183a1e195ea65d.jpg",
  "/images/z5973016052782_025_19c0c99e3fde6523cd8304873f4cd32b.jpg",
  "/images/z5973016052782_026_d92d429b93eeed23b5e421c35ad487f0.jpg",
  "/images/z5973016052782_027_c5c31f0421e11b526afe698afd4a40c6.jpg",
  "/images/z5973016052782_028_de2e864413d98de0e7065526bcda0a9b.jpg",
  "/images/z5973016052782_029_f4126be02ae675c5da8af7e74d1a4e6e.jpg",
  "/images/z5973016052782_030_1be57f77c7f076dbeb27c4a9038a7eb4.jpg",
  "/images/z5973016052782_031_89cddab0d9d7b03b64452b4510032c44.jpg",
  "/images/z5973016052782_032_c66ba8063ea66fd168286af447017c70.jpg",
  "/images/z6087575440824_ce9aa60662b8fbab6d628891c4e37629.jpg",
  "/images/z6087575463799_72ea31920c1341a3eec14b08a93c3c81.jpg",
  "/images/z6087575479563_100ce1a07bb55ac7a2beacadaacaefac.jpg",
  "/images/z6087575479566_5fe3c1be5ad19460415b4a9d67d3fb8a.jpg",
  "/images/z6087575482857_d05b45fd9decd52881f7b8aefc060cf2.jpg",
  "/images/z6087575487897_c240c4136fbe9e856d64f7be0811014d.jpg",
  "/images/z6087575494598_87ab786058a0e1cbc9c915cbb42d1ca1.jpg",
  "/images/468862554_563786026400921_5520598281853018968_n.jpg",
  "/images/468863381_563786129734244_1178466087813228077_n.jpg",
  "/images/468894980_563786209734236_5985034190604803221_n.jpg",
  "/images/468905725_563786053067585_4858302212117326176_n.jpg",
  "/images/468962943_563785973067593_5328556259022264401_n.jpg",
  "/images/468978074_563786119734245_6803494505651830051_n.jpg",
  "/images/469044009_563786339734223_4578560779350305484_n.jpg",
  "/images/469116216_563785989734258_1225012571805857304_n.jpg",
  "/images/469121079_563786353067555_9078598978828265818_n.jpg",
  "/images/469143961_563786233067567_545219856122667300_n.jpg",
  "/images/471646943_582695291176661_2570579736408709495_n.jpg",
  "/images/471654841_582701441176046_3294254267803376358_n.jpg",
  "/images/471664770_582701431176047_7060442882727758717_n.jpg",
  "/images/471700920_582701364509387_8906448552685656771_n.jpg",
  "/images/471746118_582701374509386_8551467312860881778_n.jpg",
  "/images/471858081_582701481176042_2642988102857680941_n.jpg",
  "/images/474007589_598396856273171_2111071297923646773_n.jpg",
  "/images/474071584_598395686273288_3457685561741518136_n.jpg",
  "/images/474074724_598396812939842_962371998718308862_n.jpg",
  "/images/474096011_598395709606619_2962262759380864078_n.jpg",
  "/images/474256181_598396836273173_5250701498619979485_n.jpg",
  "/images/474623786_601036502675873_417465206065548771_n.jpg",
  "/images/474626647_601036489342541_1279715244984058606_n.jpg",
  "/images/474682136_601036496009207_8639658317074689251_n.jpg",
  "/images/474738817_601036732675850_1375881422591087309_n.jpg",
  "/images/474765961_601036846009172_4953905943138151340_n.jpg",
  "/images/474779314_601036762675847_3541346204575328241_n.jpg",
  "/images/474795441_601036752675848_3189221237306170939_n.jpg",
  "/images/474850664_601036476009209_4739041144709341589_n.jpg",
  "/images/474866685_601036869342503_8599911458419294757_n.jpg",
  "/images/474956406_601036816009175_6723609090066033292_n.jpg",
  "/images/475053085_601036852675838_2402443290344397682_n.jpg",
  "/images/475142209_601036779342512_1060912070919921037_n.jpg",
  "/images/475142254_601036782675845_6634806078986385702_n.jpg",
  "/images/475144344_601036842675839_4404505197731612851_n.jpg",
  "/images/475155703_601036529342537_8421055415684565978_n.jpg",
  "/images/475780202_607359382043585_3034294918827921029_n.jpg",
  "/images/475818898_607359325376924_456497694779876643_n.jpg",
  "/images/475848156_607359262043597_4715828726527841259_n.jpg",
  "/images/475969919_607359408710249_8516488549860876522_n.jpg",
  "/images/475980485_607359355376921_1824534271337068094_n.jpg",
  "/images/476090611_607359335376923_6698951151074247924_n.jpg",
  "/images/476169254_607359535376903_7286281109057041354_n.jpg",
  "/images/476234772_607359238710266_119489637807075507_n.jpg",
  "/images/481140462_626892440090279_6752106142656858356_n.jpg",
  "/images/485062990_641440001968856_1788598474458634496_n.jpg",
  "/images/485063030_641440021968854_1074023557985153228_n.jpg",
  "/images/485143849_641439991968857_8166740877775122323_n.jpg",
  "/images/488908023_653579827421540_5935849463958993947_n.jpg",
  "/images/490177832_658446420268214_347614883182770774_n.jpg",
  "/images/490443846_658446426934880_5562347315263916673_n.jpg",
  "/images/490592059_658446380268218_23591485498949886_n.jpg",
  "/images/490647100_658446473601542_4306727507599707816_n.jpg",
  "/images/490848064_658446366934886_1742058043239402373_n.jpg",
  "/images/494314495_672776768835179_1497338477261864599_n.jpg",
  "/images/494353075_672776775501845_4965141204955899499_n.jpg",
  "/images/494644807_672776822168507_3210103914200477472_n.jpg",
  "/images/495013016_672776815501841_6112291942365215539_n.jpg",
];

const afterMatchImages = [
  "/images/After Match/480980877_623996403713216_5920153029135494897_n.jpg",
  "/images/After Match/480988725_623995013713355_2013348546939563105_n.jpg",
  "/images/After Match/481302045_623994717046718_6367270203417339327_n.jpg",
];

const eventsImages = [
  "/images/Events/475506305_607359298710260_2334271900033905389_n.jpg",
  "/images/Events/475545052_607359248710265_3911065597263512063_n.jpg",
  "/images/Events/475698443_607359302043593_3511584171185863671_n.jpg",
  "/images/Events/475792307_607359232043600_2943844154310647044_n.jpg",
  "/images/Events/475795770_607359112043612_7418395893194555409_n.jpg",
  "/images/Events/475839465_607359168710273_3036126754752063146_n.jpg",
  "/images/Events/475845490_607359155376941_3382075745430913768_n.jpg",
  "/images/Events/475951713_607359278710262_1054903980676307615_n.jpg",
  "/images/Events/476208910_607359245376932_3593847638994941124_n.jpg",
  "/images/Events/480927583_623995920379931_2863727569859176086_n.jpg",
  "/images/Events/481262373_623998213713035_7248181858664384245_n.jpg",
  "/images/Events/481276435_623998250379698_8736554557242586485_n.jpg",
];

const galleryVideos = [
  "/images/6087575622292.mp4",
  "/images/6087576712492.mp4",
  "/images/6087577007740.mp4",
  "/images/6087578243547.mp4",
  "/images/6087578676347.mp4",
  "/images/6087579349490.mp4",
  "/images/6087595867935.mp4",
  "/images/6087596098604.mp4",
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const isVideo = (path: string) => path.endsWith(".mp4");

// ── Component ─────────────────────────────────────────────────────────────────
export default function GalleryPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAsset, setModalAsset] = useState<string | null>(null);
  const [modalIdx, setModalIdx] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadCount, setUploadCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [galleryAssets, setGalleryAssets] = useState<AdminGalleryImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    adminService
      .getGallery()
      .then(setGalleryAssets)
      .catch((err) => console.error("Gallery sync failed:", err));
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/gallery/count?userId=${session.user.id}`)
        .then((r) => r.json())
        .then((d) => setUploadCount(d.count))
        .catch(console.error);
    }
  }, [session]);

  const tabs = [
    {
      label: "All Media",
      assets: [
        ...galleryImages,
        ...galleryVideos,
        ...afterMatchImages,
        ...eventsImages,
        ...galleryAssets.map((img) => img.url),
      ],
    },
    { label: "Events", assets: eventsImages },
    { label: "Matches", assets: afterMatchImages },
    { label: "Videos", assets: galleryVideos },
  ];

  const assets = tabs[activeTab]?.assets ?? [];

  const openModal = (src: string, idx: number) => {
    setModalAsset(src);
    setModalIdx(idx);
    setModalOpen(true);
  };

  const showPrev = () => {
    if (modalIdx > 0) {
      const i = modalIdx - 1;
      setModalAsset(assets[i]);
      setModalIdx(i);
    }
  };

  const showNext = () => {
    if (modalIdx < assets.length - 1) {
      const i = modalIdx + 1;
      setModalAsset(assets[i]);
      setModalIdx(i);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!modalOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modalOpen, modalIdx]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", selectedCategory);
      const res = await fetch("/api/gallery/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed.");
      }
      setUploadCount((c) => c + 1);
      window.location.reload();
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload error.");
    } finally {
      setUploading(false);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500/20 border-t-amber-500" />
          <p className="text-sm font-medium text-slate-600">Loading gallery…</p>
        </div>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* ── Hero ── */}
      <section className="relative isolate overflow-hidden border-b border-slate-200/80 pt-28 pb-12 md:pt-32 md:pb-16">
        <div className="absolute inset-0 -z-20">
          <Image
            src="/images/hero_final.jpg"
            alt=""
            fill
            priority
            className="object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-slate-50/95 to-slate-50" />
        </div>
        <div className="absolute -left-24 top-20 h-64 w-64 rounded-full bg-amber-400/15 blur-3xl -z-10" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl -z-10" />

        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-800">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              FC Escuela Visual Archive
            </p>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              Media{" "}
              <span className="bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 bg-clip-text text-transparent">
                Gallery
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-slate-600 md:text-base">
              Match day highlights, training sessions, and academy events — all in one place.
            </p>

            {/* Stats row */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 md:gap-10">
              {[
                { label: "Photos", value: galleryImages.length + afterMatchImages.length + eventsImages.length },
                { label: "Videos", value: galleryVideos.length },
                { label: "Total Assets", value: tabs[0].assets.length },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-black text-slate-900 md:text-3xl">{s.value}</p>
                  <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Toolbar ── */}
      <div className="container-custom py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          {/* Tab filters */}
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab, idx) => (
              <button
                key={tab.label}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`rounded-xl px-5 py-2 text-[11px] font-bold uppercase tracking-wider transition ${
                  activeTab === idx
                    ? "bg-slate-900 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {tab.label}
                <span className="ml-2 opacity-60">{tab.assets.length}</span>
              </button>
            ))}
          </div>

          {/* Upload (logged-in only) */}
          {session ? (
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
              <div className="hidden border-r border-slate-100 px-3 sm:block">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Your uploads
                </p>
                <p className="mt-0.5 text-sm font-black text-slate-900">{uploadCount}</p>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-[11px] font-semibold text-slate-600 outline-none focus:ring-0 border-none cursor-pointer"
              >
                <option value="general">General</option>
                <option value="after-match">Matches</option>
                <option value="events">Events</option>
              </select>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white transition hover:bg-amber-500 hover:text-slate-950 disabled:opacity-50"
              >
                <ArrowUpTrayIcon className="h-4 w-4" />
                {uploading ? "Uploading…" : "Upload"}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*,video/*"
                className="hidden"
              />
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-2 text-[11px] font-semibold text-amber-700">
              <PhotoIcon className="h-4 w-4" />
              Sign in to upload photos
            </div>
          )}
        </div>

        {/* Upload error */}
        {uploadError && (
          <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
            {uploadError}
          </p>
        )}
      </div>

      {/* ── Masonry Grid ── */}
      <div className="container-custom pb-20">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3 xl:columns-4"
          >
            {assets.map((src, idx) => (
              <motion.div
                key={src}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.02, 0.5), duration: 0.4 }}
                className="break-inside-avoid"
              >
                <div
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  onClick={() => openModal(src, idx)}
                >
                  {isVideo(src) ? (
                    <div className="relative aspect-video bg-slate-900">
                      <video className="h-full w-full object-cover opacity-90">
                        <source src={src} type="video/mp4" />
                      </video>
                      {/* Play overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-950/30 transition group-hover:bg-slate-950/50">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition group-hover:scale-110">
                          <PlayIcon className="h-5 w-5 translate-x-0.5 text-slate-900" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 left-2 rounded-full bg-slate-900/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                        Video
                      </span>
                    </div>
                  ) : (
                    <div className="relative overflow-hidden">
                      <img
                        src={src}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-auto object-cover transition duration-500 group-hover:scale-[1.04]"
                        loading="lazy"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-slate-950/0 transition duration-300 group-hover:bg-slate-950/20 flex items-center justify-center">
                        <div className="scale-75 opacity-0 transition duration-300 group-hover:scale-100 group-hover:opacity-100 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm">
                          <PhotoIcon className="h-4 w-4 text-slate-900" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {assets.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-8 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <PhotoIcon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No media here</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">
              Nothing has been added to this collection yet.
            </p>
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {modalOpen && modalAsset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] flex flex-col bg-slate-950/95 backdrop-blur-xl"
            onClick={() => setModalOpen(false)}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {isVideo(modalAsset) ? "Video" : "Photo"} · {modalIdx + 1} / {assets.length}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Main viewer */}
            <div
              className="relative flex flex-1 items-center justify-center px-4 md:px-16"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Prev */}
              <button
                type="button"
                onClick={showPrev}
                disabled={modalIdx === 0}
                className="absolute left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/15 hover:text-white disabled:opacity-20 md:left-6"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={modalAsset}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                  className="relative flex max-h-[75vh] w-full max-w-5xl items-center justify-center"
                >
                  {isVideo(modalAsset) ? (
                    <video
                      key={modalAsset}
                      controls
                      autoPlay
                      className="max-h-[75vh] w-full rounded-xl object-contain shadow-2xl"
                    >
                      <source src={modalAsset} type="video/mp4" />
                    </video>
                  ) : (
                    <div className="relative max-h-[75vh] w-full">
                      <Image
                        src={modalAsset}
                        alt={`Gallery item ${modalIdx + 1}`}
                        width={1400}
                        height={900}
                        className="max-h-[75vh] w-auto mx-auto rounded-xl object-contain shadow-2xl"
                        priority
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Next */}
              <button
                type="button"
                onClick={showNext}
                disabled={modalIdx === assets.length - 1}
                className="absolute right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/15 hover:text-white disabled:opacity-20 md:right-6"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Filmstrip */}
            <div
              className="mx-auto mt-4 w-full max-w-4xl overflow-x-auto px-4 pb-6 custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex gap-2 py-2">
                {assets.map((asset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setModalAsset(asset);
                      setModalIdx(i);
                    }}
                    className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                      i === modalIdx
                        ? "border-amber-500 opacity-100 scale-105"
                        : "border-white/10 opacity-40 hover:opacity-80"
                    }`}
                  >
                    {isVideo(asset) ? (
                      <div className="flex h-full w-full items-center justify-center bg-slate-800">
                        <PlayIcon className="h-4 w-4 text-white/60" />
                      </div>
                    ) : (
                      <Image
                        src={asset}
                        alt={`Thumbnail ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}