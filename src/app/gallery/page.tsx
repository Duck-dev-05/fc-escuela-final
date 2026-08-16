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
  FilmIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { appService, GalleryImage } from "@/services/local-api";

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

// Tab config
const TAB_ICONS = [Squares2X2Icon, PhotoIcon, PhotoIcon, FilmIcon];

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
  const [galleryAssets, setGalleryAssets] = useState<GalleryImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const filmstripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    appService
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

  // Featured = first 3 non-video assets of current tab
  const featuredAssets = assets.filter((a) => !isVideo(a)).slice(0, 3);
  // Grid = rest
  const gridAssets = assets.slice(0);

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

  // Auto-scroll filmstrip to active thumb
  useEffect(() => {
    if (!filmstripRef.current) return;
    const active = filmstripRef.current.querySelector(`[data-idx="${modalIdx}"]`) as HTMLElement;
    if (active) active.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [modalIdx]);

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
      <div className="flex min-h-screen items-center justify-center bg-[#080808]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-red-500/20 border-t-red-500" />
            <div className="absolute inset-2 rounded-full bg-red-500/5" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Loading gallery…</p>
        </div>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#080808] text-slate-200">

      {/* ── CINEMATIC HERO ── */}
      <section className="relative isolate overflow-hidden border-b border-white/8 pt-28 pb-14 md:pt-36 md:pb-20">
        {/* Background image */}
        <div className="absolute inset-0 -z-20">
          <Image
            src="/images/hero_final.jpg"
            alt=""
            fill
            priority
            className="object-cover opacity-[0.12]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/70 via-[#080808]/85 to-[#080808]" />
        </div>

        {/* Ambient glows */}
        <div className="absolute -left-32 top-16 h-80 w-80 rounded-full bg-red-500/10 blur-[100px] -z-10 animate-float" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-slate-400/5 blur-[80px] -z-10 animate-float-delayed" />

        {/* Scan line */}
        <div className="absolute inset-0 -z-10 animate-scan" />

        {/* Ghost text */}
        <div className="absolute bottom-0 right-0 text-[clamp(60px,12vw,160px)] font-black uppercase tracking-tighter leading-none text-transparent select-none pointer-events-none"
          style={{ WebkitTextStroke: "1px rgba(239,68,68,0.05)" }}>
          GALLERY
        </div>

        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-3xl text-center"
          >
            {/* Eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/8 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-red-400 backdrop-blur-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              FC Escuela Visual Archive
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.18 }}
              className="text-5xl font-black tracking-tight text-white sm:text-6xl md:text-7xl"
            >
              Media{" "}
              <span className="bg-gradient-to-br from-rose-300 via-red-500 to-red-700 bg-clip-text text-transparent">
                Gallery
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.28 }}
              className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-slate-400 md:text-base"
            >
              Match day highlights, training sessions, and academy events — all in one place.
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.38 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-8 md:gap-14"
            >
              {[
                { label: "Photos", value: galleryImages.length + afterMatchImages.length + eventsImages.length },
                { label: "Videos", value: galleryVideos.length },
                { label: "Total Assets", value: tabs[0].assets.length },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl font-black text-white md:text-4xl tracking-tight">{s.value}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── STICKY TOOLBAR (pills + upload) ── */}
      <div className="sticky top-[58px] z-40 border-b border-white/8 bg-[#080808]/95 backdrop-blur-xl">
        <div className="container-custom py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            {/* Pill tabs */}
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab, idx) => {
                const Icon = TAB_ICONS[idx];
                const active = activeTab === idx;
                return (
                  <button
                    key={tab.label}
                    type="button"
                    onClick={() => setActiveTab(idx)}
                    className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
                      active ? "pill-active" : "pill-inactive"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tab.label}
                    <span
                      className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-black transition-colors ${
                        active ? "bg-white/20 text-white" : "bg-white/5 text-slate-600"
                      }`}
                    >
                      {tab.assets.length}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Upload (logged-in only) */}
            {session ? (
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-2 shadow-sm backdrop-blur-sm">
                <div className="hidden border-r border-white/10 pr-3 sm:block">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Your uploads
                  </p>
                  <p className="mt-0.5 text-sm font-black text-white">{uploadCount}</p>
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-lg bg-white/5 px-2 py-1 text-[11px] font-semibold text-slate-400 outline-none focus:ring-0 border border-white/10 cursor-pointer"
                >
                  <option value="general">General</option>
                  <option value="after-match">Matches</option>
                  <option value="events">Events</option>
                </select>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white transition hover:bg-red-600 active:scale-95 disabled:opacity-50"
                  style={{ boxShadow: "0 0 14px rgba(239,68,68,0.3)" }}
                >
                  {uploading ? (
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <ArrowUpTrayIcon className="h-3.5 w-3.5" />
                  )}
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
              <div className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-[11px] font-semibold text-red-400">
                <PhotoIcon className="h-4 w-4" />
                Sign in to upload photos
              </div>
            )}
          </div>

          {/* Upload error */}
          {uploadError && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400"
            >
              {uploadError}
            </motion.p>
          )}
        </div>
      </div>

      {/* ── GALLERY BODY ── */}
      <div className="container-custom pt-10 pb-24">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
          >
            {/* ── FEATURED SPOTLIGHT (first 3 non-video) ── */}
            {featuredAssets.length >= 3 && (
              <div className="mb-8">
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-px flex-1 bg-white/5" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-600">Spotlight</p>
                  <span className="h-px flex-1 bg-white/5" />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {featuredAssets.map((src, idx) => (
                    <motion.div
                      key={src + "-featured"}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.07, duration: 0.45 }}
                      className="gallery-card group"
                      style={{ aspectRatio: idx === 0 ? "16/10" : "4/3" }}
                      onClick={() => openModal(src, assets.indexOf(src))}
                    >
                      <img
                        src={src}
                        alt={`Spotlight ${idx + 1}`}
                        className="h-full w-full object-cover transition-transform duration-500"
                        loading="lazy"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-950/0 transition-all duration-300 group-hover:bg-slate-950/25">
                        <div className="scale-75 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-xl backdrop-blur-sm">
                          <PhotoIcon className="h-5 w-5 text-slate-900" />
                        </div>
                      </div>
                      {/* Index badge */}
                      <div className="absolute top-3 left-3 flex h-6 w-6 items-center justify-center rounded-full bg-slate-950/70 backdrop-blur-sm text-[10px] font-black text-white">
                        {idx + 1}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* ── MASONRY GRID ── */}
            {assets.length > 0 && (
              <>
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-px flex-1 bg-white/5" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-600">All Media</p>
                  <span className="h-px flex-1 bg-white/5" />
                </div>

                <div className="columns-1 gap-3 space-y-3 sm:columns-2 lg:columns-3 xl:columns-4">
                  {gridAssets.map((src, idx) => (
                    <div
                      key={src + idx}
                      className="break-inside-avoid animate-masonry-in"
                      style={{ animationDelay: `${Math.min(idx * 0.018, 0.6)}s` }}
                    >
                      <div
                        className="gallery-card group"
                        onClick={() => openModal(src, idx)}
                      >
                        {isVideo(src) ? (
                          /* ── VIDEO CARD ── */
                          <div className="relative aspect-video bg-slate-900/80">
                            <video className="h-full w-full object-cover opacity-70">
                              <source src={src} type="video/mp4" />
                            </video>
                            {/* Cinematic play overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-t from-slate-950/60 via-slate-950/20 to-transparent transition-all duration-300 group-hover:from-slate-950/80">
                              <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:border-red-500/60 group-hover:bg-red-500/20">
                                <PlayIcon className="h-6 w-6 translate-x-0.5 text-white" />
                              </div>
                            </div>
                            {/* Video badge */}
                            <div className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-950/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                              <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                              Video
                            </div>
                          </div>
                        ) : (
                          /* ── PHOTO CARD ── */
                          <div className="relative overflow-hidden">
                            <img
                              src={src}
                              alt={`Gallery ${idx + 1}`}
                              className="w-full h-auto object-cover transition-transform duration-500"
                              loading="lazy"
                            />
                            {/* Hover overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/0 transition-all duration-300 group-hover:bg-slate-950/20">
                              <div className="scale-75 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm">
                                <PhotoIcon className="h-4 w-4 text-slate-900" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── Empty State ── */}
            {assets.length === 0 && (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-8 py-20 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-600">
                  <PhotoIcon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-white">Nothing here yet</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                  Nothing has been added to this collection yet.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── CINEMATIC LIGHTBOX ── */}
      <AnimatePresence>
        {modalOpen && modalAsset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[9999] flex flex-col lightbox-bg"
            onClick={() => setModalOpen(false)}
          >
            {/* ── Lightbox Header ── */}
            <div
              className="flex items-center justify-between px-6 py-4 border-b border-white/8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4">
                {/* Counter badge */}
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  <span className="text-[11px] font-black text-white">{modalIdx + 1}</span>
                  <span className="text-[11px] text-slate-500">/</span>
                  <span className="text-[11px] font-bold text-slate-400">{assets.length}</span>
                </div>
                {/* Type badge */}
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  {isVideo(modalAsset) ? "Video" : "Photo"}
                </span>
              </div>

              {/* Close */}
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white hover:border-red-500/30 active:scale-95"
              >
                <XMarkIcon className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* ── Main Viewer ── */}
            <div
              className="relative flex flex-1 items-center justify-center px-4 md:px-20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Prev arrow */}
              <button
                type="button"
                onClick={showPrev}
                disabled={modalIdx === 0}
                className="absolute left-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/12 hover:text-white hover:border-red-500/30 disabled:opacity-20 md:left-8 active:scale-95"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={modalAsset}
                  initial={{ opacity: 0, scale: 0.95, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex max-h-[72vh] w-full max-w-5xl items-center justify-center"
                >
                  {isVideo(modalAsset) ? (
                    <video
                      key={modalAsset}
                      controls
                      autoPlay
                      className="max-h-[72vh] w-full rounded-2xl object-contain shadow-2xl border border-white/8"
                    >
                      <source src={modalAsset} type="video/mp4" />
                    </video>
                  ) : (
                    <div className="relative max-h-[72vh] w-full flex justify-center">
                      <Image
                        src={modalAsset}
                        alt={`Gallery item ${modalIdx + 1}`}
                        width={1400}
                        height={900}
                        className="max-h-[72vh] w-auto rounded-2xl object-contain shadow-2xl border border-white/8"
                        priority
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Next arrow */}
              <button
                type="button"
                onClick={showNext}
                disabled={modalIdx === assets.length - 1}
                className="absolute right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/12 hover:text-white hover:border-red-500/30 disabled:opacity-20 md:right-8 active:scale-95"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>

            {/* ── Filmstrip ── */}
            <div
              className="border-t border-white/8 bg-slate-950/50 px-4 py-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                ref={filmstripRef}
                className="mx-auto flex max-w-4xl gap-2 overflow-x-auto py-1 custom-scrollbar"
              >
                {assets.map((asset, i) => (
                  <button
                    key={i}
                    data-idx={i}
                    type="button"
                    onClick={() => {
                      setModalAsset(asset);
                      setModalIdx(i);
                    }}
                    className={`filmstrip-thumb ${
                      i === modalIdx ? "filmstrip-thumb-active" : "filmstrip-thumb-inactive"
                    }`}
                  >
                    {isVideo(asset) ? (
                      <div className="flex h-full w-full items-center justify-center bg-slate-800/80">
                        <PlayIcon className="h-4 w-4 text-white/50" />
                      </div>
                    ) : (
                      <Image
                        src={asset}
                        alt={`Thumb ${i + 1}`}
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