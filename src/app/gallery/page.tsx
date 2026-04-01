"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { 
  FaLock, FaPhotoVideo, FaUpload, FaChevronLeft, 
  FaChevronRight, FaTimes, FaExpand, FaClock, FaBroadcastTower 
} from 'react-icons/fa';

const galleryImages = [
  "/images/Team.jpg",
  "/images/476090611_607359335376923_6698951151074247924_n.jpg",
  "/images/475848156_607359262043597_4715828726527841259_n.jpg",
  "/images/475969919_607359408710249_8516488549860876522_n.jpg",
  "/images/476234772_607359238710266_119489637807075507_n.jpg",
  "/images/476169254_607359535376903_7286281109057041354_n.jpg",
  "/images/475780202_607359382043585_3034294918827921029_n.jpg",
  "/images/475818898_607359325376924_456497694779876643_n.jpg",
  "/images/475980485_607359355376921_1824534271337068094_n.jpg",
  "/images/475155703_601036529342537_8421055415684565978_n.jpg",
  "/images/475053085_601036852675838_2402443290344397682_n.jpg",
  "/images/475144344_601036842675839_4404505197731612851_n.jpg",
  "/images/474779314_601036762675847_3541346204575328241_n.jpg",
  "/images/474850664_601036476009209_4739041144709341589_n.jpg",
  "/images/474795441_601036752675848_3189221237306170939_n.jpg",
  "/images/474866685_601036869342503_8599911458419294757_n.jpg",
  "/images/474682136_601036496009207_8639658317074689251_n.jpg",
  "/images/475142254_601036782675845_6634806078986385702_n.jpg",
  "/images/474738817_601036732675850_1375881422591087309_n.jpg",
  "/images/475195562_601036736009183_6750024295008285303_n.jpg",
  "/images/475142209_601036779342512_1060912070919921037_n.jpg",
  "/images/474765961_601036846009172_4953905943138151340_n.jpg",
  "/images/474956406_601036816009175_6723609090066033292_n.jpg",
  "/images/474626647_601036489342541_1279715244984058606_n.jpg",
  "/images/474623786_601036502675873_417465206065548771_n.jpg",
  "/images/474074724_598396812939842_962371998718308862_n.jpg",
  "/images/474256181_598396836273173_5250701498619979485_n.jpg",
  "/images/474007589_598396856273171_2111071297923646773_n.jpg",
  "/images/474096011_598395709606619_2962262759380864078_n.jpg",
  "/images/474071584_598395686273288_3457685561741518136_n.jpg",
  "/images/485143849_641439991968857_8166740877775122323_n.jpg",
  "/images/481140462_626892440090279_6752106142656858356_n.jpg",
  "/images/485062990_641440001968856_1788598474458634496_n.jpg",
  "/images/485063030_641440021968854_1074023557985153228_n.jpg",
  "/images/488908023_653579827421540_5935849463958993947_n.jpg",
  "/images/490592059_658446380268218_23591485498949886_n.jpg",
  "/images/490848064_658446366934886_1742058043239402373_n.jpg",
  "/images/490177832_658446420268214_347614883182770774_n.jpg",
  "/images/490443846_658446426934880_5562347315263916673_n.jpg",
  "/images/490647100_658446473601542_4306727507599707816_n.jpg",
  "/images/494353075_672776775501845_4965141204955899499_n.jpg",
  "/images/494314495_672776768835179_1497338477261864599_n.jpg",
  "/images/495013016_672776815501841_6112291942365215539_n.jpg",
  "/images/494644807_672776822168507_3210103914200477472_n.jpg",
  "/images/z6087575494598_87ab786058a0e1cbc9c915cbb42d1ca1.jpg",
  "/images/z6087575487897_c240c4136fbe9e856d64f7be0811014d.jpg",
  "/images/z6087575482857_d05b45fd9decd52881f7b8aefc060cf2.jpg",
  "/images/z6087575479566_5fe3c1be5ad19460415b4a9d67d3fb8a.jpg",
  "/images/z6087575479563_100ce1a07bb55ac7a2beacadaacaefac.jpg",
  "/images/z6087575463799_72ea31920c1341a3eec14b08a93c3c81.jpg",
  "/images/z6087575440824_ce9aa60662b8fbab6d628891c4e37629.jpg",
  "/images/z5973016052782_032_c66ba8063ea66fd168286af447017c70.jpg",
  "/images/z5973016052782_031_89cddab0d9d7b03b64452b4510032c44.jpg",
  "/images/z5973016052782_030_1be57f77c7f076dbeb27c4a9038a7eb4.jpg",
  "/images/z5973016052782_029_f4126be02ae675c5da8af7e74d1a4e6e.jpg",
  "/images/z5973016052782_028_de2e864413d98de0e7065526bcda0a9b.jpg",
  "/images/z5973016052782_027_c5c31f0421e11b526afe698afd4a40c6.jpg",
  "/images/z5973016052782_025_19c0c99e3fde6523cd8304873f4cd32b.jpg",
  "/images/z5973016052782_024_903cfe4ad96e0f3ec3183a1e195ea65d.jpg",
  "/images/z5973016052782_023_2f600f5f1e257b02427476751201de5b.jpg",
  "/images/z5973016052782_022_3faa2c9433a16cd2663f241b4a17efe7.jpg",
  "/images/z5973016052782_021_08352a116dcbc570b8e02e43c1be2aa5.jpg",
  "/images/z5973016052782_020_04a7f35c28e027ba3ed4f63adfad54fd.jpg",
  "/images/z5973016052782_019_faa191f96924fd80d011004581c35c62.jpg",
  "/images/z5973016052782_018_d84f316aa147fc673d990a0cbb76a26d.jpg",
  "/images/z5973016052782_017_d38214a28aa2e76748f4211340e3dc41.jpg",
  "/images/z5973016052782_016_adb8d5814856736c7e4acdede2bb606d.jpg",
  "/images/z5973016052782_015_1b8201f1cc99484d73796856439bcf67.jpg",
  "/images/z5973016052782_014_c27408425d9e17f84c64ea41ac2f375f.jpg",
  "/images/z5973016052782_013_5ea124340516ab9f428c2f369e3de63f.jpg",
  "/images/z5973016052782_012_347af6f41ce9410bb3ccdcd33a13bb75.jpg",
  "/images/z5973016052782_011_8c9e48650bcebc0ace8232f11e9bc7e8.jpg",
  "/images/z5973016052782_010_7ed90876f2e0c1394b4810a0ceb81307.jpg",
  "/images/z5973016052782_009_086b948f1e03d07304db4233e6fa3a48.jpg",
  "/images/z5973016052782_008_1f51f84119fa442f24763bcdca13d68e.jpg",
  "/images/z5973016052782_007_f9a2923635343ebbc23dfa1b20d2b06b.jpg",
  "/images/z5973016052782_006_4a3d9155df36aaa0a0f46ea87b287929.jpg",
  "/images/z5973016052782_005_4ca298975090cb17a3c98db94c3bfd5f.jpg",
  "/images/z5973016052782_004_5c4d60c05ca5bbad90105f448b75663f.jpg",
  "/images/z5973016052782_003_cc79159abbb5a68bf4d33000377f0dde.jpg",
  "/images/z5973016052782_002_273b5235652a3dfb76bf40d8a50b698c.jpg",
  "/images/z5973016052782_001_d51bdad3cd2ed2e981bc093e51fc3903.jpg",
  "/images/DSC_0014.jpg",
  "/images/DSC_0013.jpg",
  "/images/DSC_0012.jpg",
  "/images/DSC_0011.jpg",
  "/images/DSC_0010.jpg",
  "/images/DSC_0009.jpg",
  "/images/DSC_0008.jpg",
  "/images/DSC_0007.jpg",
];

const afterMatchImages = [
  "/images/After Match/481302045_623994717046718_6367270203417339327_n.jpg",
  "/images/After Match/480980877_623996403713216_5920153029135494897_n.jpg",
  "/images/After Match/480988725_623995013713355_2013348546939563105_n.jpg",
];

const eventsImages = [
  "/images/Events/481276435_623998250379698_8736554557242586485_n.jpg",
  "/images/Events/480927583_623995920379931_2863727569859176086_n.jpg",
  "/images/Events/481262373_623998213713035_7248181858664384245_n.jpg",
  "/images/Events/475506305_607359298710260_2334271900033905389_n.jpg",
  "/images/Events/475545052_607359248710265_3911065597263512063_n.jpg",
  "/images/Events/475792307_607359232043600_2943844154310647044_n.jpg",
  "/images/Events/475951713_607359278710262_1054903980676307615_n.jpg",
  "/images/Events/476208910_607359245376932_3593847638994941124_n.jpg",
  "/images/Events/475839465_607359168710273_3036126754752063146_n.jpg",
  "/images/Events/475845490_607359155376941_3382075745430913768_n.jpg",
  "/images/Events/475698443_607359302043593_3511584171185863671_n.jpg",
  "/images/Events/475795770_607359112043612_7418395893194555409_n.jpg",
];

import { adminService, AdminGalleryImage } from "@/services/admin-api";

export default function GalleryPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState<string | null>(null);
  const [modalIdx, setModalIdx] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadCount, setUploadCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [galleryAssets, setGalleryAssets] = useState<AdminGalleryImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const syncGallery = async () => {
      try {
        const data = await adminService.getGallery();
        setGalleryAssets(data);
      } catch (err) {
        console.error("Gallery sync interrupted:", err);
      }
    };
    syncGallery();
  }, []);

  const tabs = [
    { label: "All Units", images: galleryAssets.map(img => img.url) },
    { label: "Deployment", images: galleryAssets.filter(img => img.category === 'after-match').map(img => img.url) },
    { label: "Operations", images: galleryAssets.filter(img => img.category === 'events').map(img => img.url) },
  ];

  const images = tabs[activeTab]?.images || [];

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/gallery/count?userId=${session.user.id}`)
        .then(res => res.json())
        .then(data => setUploadCount(data.count))
        .catch(console.error);
    }
  }, [session]);

  const handleImageClick = (src: string, idx: number) => {
    setModalImg(src);
    setModalIdx(idx);
    setModalOpen(true);
  };

  const showPrev = () => {
    if (modalIdx > 0) {
      const prevIdx = modalIdx - 1;
      setModalImg(images[prevIdx]);
      setModalIdx(prevIdx);
    }
  };
  const showNext = () => {
    if (modalIdx < images.length - 1) {
      const nextIdx = modalIdx + 1;
      setModalImg(images[nextIdx]);
      setModalIdx(nextIdx);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", selectedCategory);
      const response = await fetch("/api/gallery/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload protocol failure.");
      }
      setUploadCount(prev => prev + 1);
      window.location.reload();
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Sychronization Rejected.");
    } finally {
      setUploading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
        <div className="flex flex-col items-center gap-6 animate-pulse">
           <div className="w-16 h-16 border-t-2 border-l-2 border-yellow-500 hud-border rounded-full animate-spin"></div>
           <p className="text-yellow-500 font-bold uppercase tracking-[0.3em] text-xs">Accessing Media Vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-20 px-4 relative overflow-hidden animate-scan">
      {/* Ghost Typography Background */}
      <div className="absolute top-10 right-10 select-none pointer-events-none opacity-5 text-right">
        <span className="text-[15vw] ghost-text leading-none uppercase">VAULT</span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 animate-slide-up">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                 <FaPhotoVideo className="text-yellow-500 text-2xl" />
              </div>
              <div>
                 <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Media <span className="text-yellow-500">Vault</span></h1>
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">High-Fidelity Visual Archives</p>
              </div>
           </div>

           {session ? (
              <div className="flex items-center gap-4 p-2 glass-card border-white/5 rounded-xl">
                 <div className="px-4 py-2 border-r border-white/10 hidden sm:block">
                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">Upload Quota</p>
                    <p className="text-xs text-white font-bold">{uploadCount} Assets Synced</p>
                 </div>
                 <select
                   value={selectedCategory}
                   onChange={(e) => setSelectedCategory(e.target.value)}
                   className="bg-transparent text-[10px] font-black uppercase tracking-widest text-slate-400 border-none focus:ring-0 cursor-pointer"
                 >
                   <option value="general" className="bg-slate-900">General</option>
                   <option value="after-match" className="bg-slate-900">Deployment</option>
                   <option value="events" className="bg-slate-900">Operations</option>
                 </select>
                 <button
                   onClick={() => fileInputRef.current?.click()}
                   disabled={uploading}
                   className="btn-primary py-3 px-6 text-[10px] flex items-center gap-3"
                 >
                    <FaUpload />
                    {uploading ? "Syching..." : "Inject Asset"}
                 </button>
                 <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
              </div>
           ) : (
              <div className="glass-card border-yellow-500/20 bg-yellow-500/5 px-6 py-4 flex items-center gap-4 animate-pulse">
                 <FaLock className="text-yellow-500 text-sm" />
                 <span className="text-[10px] text-yellow-500 font-black uppercase tracking-widest">Sign in to initialize asset injection</span>
              </div>
           )}
        </div>

        {uploadError && (
          <div className="mb-10 p-6 glass-card border-red-500/50 bg-red-500/10 flex items-center gap-4 animate-slide-up">
            <FaTimes className="text-red-500" />
            <span className="text-xs font-black uppercase tracking-widest text-white">{uploadError}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12 animate-slide-up">
           <div className="flex p-1 glass-card border-white/5 rounded-xl">
              {tabs.map((tab, idx) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(idx)}
                  className={`px-8 py-3 text-[10px] font-black uppercase tracking-[0.3em] rounded-lg transition-all ${
                    activeTab === idx
                      ? "bg-yellow-500 text-slate-950 shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                      : "text-slate-500 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
           </div>
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-slide-up">
          {images.map((src, idx) => (
            <div
              key={idx}
              className="glass-card hud-border p-2 group cursor-pointer aspect-square relative overflow-hidden"
              onClick={() => handleImageClick(src, idx)}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              <div className="relative w-full h-full overflow-hidden rounded-lg">
                <Image
                  src={src}
                  alt={`Static Asset ${idx + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={idx < 8}
                />
                {/* HUD Overlay */}
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 text-white z-20">
                   <div className="flex items-center gap-2 mb-1">
                      <FaExpand className="text-[10px] text-yellow-500" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Enlarge Protocol</span>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cinematic Lightbox Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl animate-fade-in" onClick={() => setModalOpen(false)}>
            <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500 animate-scan" />
            
            <button className="absolute top-10 right-10 text-slate-500 hover:text-white p-4 transition-all z-[110]" onClick={() => setModalOpen(false)}>
               <FaTimes className="text-3xl" />
            </button>

            <div className="relative w-full h-full flex items-center justify-center p-4 md:p-20" onClick={e => e.stopPropagation()}>
               {/* Nav Controls */}
               <button 
                 className={`absolute left-10 top-1/2 -translate-y-1/2 w-16 h-16 glass-card border-white/5 flex items-center justify-center text-white hover:border-yellow-500/50 transition-all ${modalIdx === 0 ? 'opacity-10 pointer-events-none' : 'opacity-100'}`}
                 onClick={showPrev}
               >
                 <FaChevronLeft className="text-2xl" />
               </button>
               <button 
                 className={`absolute right-10 top-1/2 -translate-y-1/2 w-16 h-16 glass-card border-white/5 flex items-center justify-center text-white hover:border-yellow-500/50 transition-all ${modalIdx === images.length - 1 ? 'opacity-10 pointer-events-none' : 'opacity-100'}`}
                 onClick={showNext}
               >
                 <FaChevronRight className="text-2xl" />
               </button>

               <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <div className="relative w-full h-[70vh] glass-card hud-border p-2">
                     <Image
                       src={modalImg!}
                       alt="Archive Asset"
                       fill
                       className="object-contain"
                       sizes="100vw"
                     />
                  </div>
                  <div className="mt-10 flex flex-col items-center gap-4">
                     <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                           <FaClock className="text-yellow-500 text-[10px]" />
                           <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Asset Index: {modalIdx + 1}/{images.length}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <FaBroadcastTower className="text-yellow-500 text-[10px]" />
                           <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Source: Internal Vault</span>
                        </div>
                     </div>
                     <h3 className="text-xl font-black text-white uppercase tracking-[0.5em] group-hover:text-yellow-500 transition-colors">
                        Archive // {modalImg?.split('/').pop()?.split('.')[0]}
                     </h3>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}