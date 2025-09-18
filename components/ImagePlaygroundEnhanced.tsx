import React, { useState, useRef, useCallback } from 'react';
import { ScrollReveal } from './ui/scroll-reveal';
import { ImageComparison, ImageComparisonImage, ImageComparisonSlider } from './ui/image-comparison';
import { generateEffectImage } from '../lib/gemini';

// Effect Categories
const EFFECT_CATEGORIES = [
  {
    id: 'character',
    name: 'Karakter Efektleri',
    icon: 'C',
    color: 'purple'
  },
  {
    id: 'product',
    name: 'Ürün Efektleri',
    icon: 'P',
    color: 'blue'
  },
  {
    id: 'industry',
    name: 'Sektörel Efektler',
    icon: 'S',
    color: 'orange'
  },
  {
    id: 'building',
    name: 'Bina & Daire Efektleri',
    icon: 'B',
    color: 'green'
  },
  {
    id: 'automotive',
    name: 'Araba Efektleri',
    icon: 'A',
    color: 'red'
  }
];

// Specific effects for each category with examples and instructions
const CATEGORY_EFFECTS = {
  character: [
    { 
      id: 'superhero', 
      name: 'Süper Kahraman', 
      description: 'Güçlü aura ve enerji efektleri', 
      icon: 'SH',
      beforeImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop',
      instructions: 'Kişinin etrafında güçlü bir enerji alanı oluşturur. En iyi sonuç için kişi merkezi konumda olmalı ve arka plan sade olmalıdır.'
    },
    { 
      id: 'fire-eyes', 
      name: 'Ateş Gözler', 
      description: 'Gözlerden çıkan ateş efekti', 
      icon: 'FE',
      beforeImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&h=400&fit=crop',
      instructions: 'Gözlerden dramatik ateş efektleri çıkarır. Portre fotoğrafları için idealdir. Gözler net ve açık görünür olmalıdır.'
    },
    { 
      id: 'lightning-power', 
      name: 'Şimşek Gücü', 
      description: 'Ellerden çıkan şimşek', 
      icon: 'LP',
      beforeImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=400&h=400&fit=crop',
      instructions: 'Ellerden güçlü şimşek çıkarır. Eller açık ve görünür pozisyonda olmalı. Koyu arka plan daha etkili sonuçlar verir.'
    },
    { 
      id: 'teleportation', 
      name: 'Teleportasyon', 
      description: 'Parçacık dağılma efekti', 
      icon: 'TP',
      beforeImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop',
      instructions: 'Kişiyi parçacıklara dönüştürerek teleportasyon efekti yaratır. Tam vücut görüntüleri için en uygun efekttir.'
    },
    { 
      id: 'aura', 
      name: 'Güçlü Aura', 
      description: 'Etrafında enerji halkası', 
      icon: 'AU',
      beforeImage: 'https://images.unsplash.com/photo-1494790108755-2616c6b7c1e8?w=400&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      instructions: 'Kişinin etrafında parlayan enerji halkası oluşturur. Merkezi kompozisyon ve temiz arka plan önerilir.'
    },
    { 
      id: 'transformation', 
      name: 'Dönüşüm', 
      description: 'Karakter dönüşüm efekti', 
      icon: 'TR',
      beforeImage: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=400&fit=crop',
      instructions: 'Dramatik karakter dönüşümü efekti. Kişi net görünür olmalı ve dönüşüm alanı için boş alan bırakılmalıdır.'
    }
  ],
  product: [
    { 
      id: 'glow', 
      name: 'Premium Işıltı', 
      description: 'Lüks ürün ışıltısı', 
      icon: 'GL',
      beforeImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&h=400&fit=crop',
      instructions: 'Ürüne premium ışıltı efekti ekler. Ürün merkezi konumda olmalı ve arka plan nötr renklerde olmalıdır.'
    },
    { 
      id: 'floating', 
      name: 'Havada Uçma', 
      description: 'Ürün havada süzülme', 
      icon: 'FL',
      beforeImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400&h=400&fit=crop',
      instructions: 'Ürünü havada süzülüyor gibi gösterir. Ürün altında gölge alanı bırakılmalı ve temiz arka plan kullanılmalıdır.'
    },
    { 
      id: 'explosion-reveal', 
      name: 'Patlama Açılışı', 
      description: 'Dramatik ürün tanıtımı', 
      icon: 'EX',
      beforeImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&h=400&fit=crop',
      instructions: 'Ürün dramatik patlama efektiyle ortaya çıkar. Ürün etrafında efekt alanı için boş alan bırakılmalıdır.'
    },
    { 
      id: 'magic-sparkles', 
      name: 'Sihirli Parıltılar', 
      description: 'Büyülü parçacık efektleri', 
      icon: 'TP',
      beforeImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop',
      instructions: 'Ürün etrafında sihirli parıltılar yaratır. Koyu arka plan parıltıları daha belirgin gösterir.'
    },
    { 
      id: 'hologram', 
      name: 'Hologram', 
      description: 'Futuristik hologram efekti', 
      icon: 'HO',
      beforeImage: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=400&fit=crop',
      instructions: 'Ürüne futuristik hologram görünümü verir. Teknoloji ürünleri için idealdir. Sade arka plan önerilir.'
    },
    { 
      id: 'spotlight', 
      name: 'Spot Işığı', 
      description: 'Profesyonel aydınlatma', 
      icon: 'SP',
      beforeImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop',
      instructions: 'Ürüne profesyonel spot ışığı efekti ekler. Ürün merkezi konumda olmalı ve dramatik gölgeler yaratır.'
    }
  ],
  industry: [
    { 
      id: 'machinery', 
      name: 'Makine Efektleri', 
      description: 'Endüstriyel makine animasyonları', 
      icon: 'MC',
      beforeImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=400&fit=crop',
      instructions: 'Makinelere hareket ve enerji efektleri ekler. Endüstriyel ekipmanlar için idealdir. Net makine detayları gereklidir.'
    },
    { 
      id: 'steam', 
      name: 'Buhar & Duman', 
      description: 'Fabrika buhar efektleri', 
      icon: 'ST',
      beforeImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&h=400&fit=crop',
      instructions: 'Endüstriyel buhar ve duman efektleri ekler. Fabrika ve üretim görselleri için mükemmeldir.'
    },
    { 
      id: 'sparks', 
      name: 'Kaynak Kıvılcımları', 
      description: 'Metal işleme kıvılcımları', 
      icon: 'FR',
      beforeImage: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=400&h=400&fit=crop',
      instructions: 'Metal işleme kıvılcım efektleri yaratır. Kaynak ve metal işçiliği görselleri için idealdir.'
    },
    { 
      id: 'digital-grid', 
      name: 'Dijital Ağ', 
      description: 'Teknoloji ağ efektleri', 
      icon: 'DG',
      beforeImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=400&fit=crop',
      instructions: 'Dijital ağ ve bağlantı efektleri ekler. Teknoloji ve network görselleri için mükemmeldir.'
    },
    { 
      id: 'data-flow', 
      name: 'Veri Akışı', 
      description: 'Bilgi akış animasyonları', 
      icon: 'DF',
      beforeImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop',
      instructions: 'Veri akışı ve bilgi transferi efektleri. Teknoloji ve analitik görselleri için idealdir.'
    },
    { 
      id: 'construction', 
      name: 'İnşaat Efektleri', 
      description: 'Yapım süreci animasyonları', 
      icon: 'CN',
      beforeImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=400&fit=crop',
      instructions: 'İnşaat ve yapım süreci efektleri ekler. Şantiye ve inşaat görselleri için mükemmeldir.'
    }
  ],
  building: [
    { 
      id: 'window-glow', 
      name: 'Pencere Işıltısı', 
      description: 'Akşam pencere ışıkları', 
      icon: 'WG',
      beforeImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
      instructions: 'Bina pencerelerine sıcak ışık efektleri ekler. Akşam ve gece çekimlerinde en etkili sonuçları verir.'
    },
    { 
      id: 'architectural-lines', 
      name: 'Mimari Çizgiler', 
      description: 'Yapısal çizgi efektleri', 
      icon: 'AL',
      beforeImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop',
      instructions: 'Binanın mimari hatlarını vurgulayan çizgi efektleri. Modern binalar için idealdir.'
    },
    { 
      id: 'interior-warmth', 
      name: 'İç Mekan Sıcaklığı', 
      description: 'Ev sıcaklığı atmosferi', 
      icon: 'IW',
      beforeImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=400&fit=crop',
      instructions: 'İç mekanlara sıcak ve davetkar atmosfer ekler. Ev ve ofis görsellerinde mükemmel sonuçlar verir.'
    },
    { 
      id: 'cityscape', 
      name: 'Şehir Manzarası', 
      description: 'Gece şehir ışıkları', 
      icon: 'CS',
      beforeImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&h=400&fit=crop',
      instructions: 'Şehir manzaralarına gece ışıkları ve dinamizm ekler. Panoramik şehir görüntüleri için idealdir.'
    },
    { 
      id: 'luxury-ambiance', 
      name: 'Lüks Ambiyans', 
      description: 'Premium emlak atmosferi', 
      icon: 'TP',
      beforeImage: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=400&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      instructions: 'Emlak görsellerine lüks ve prestijli atmosfer ekler. Yüksek kalite iç mekan görselleri için mükemmeldir.'
    },
    { 
      id: 'garden-bloom', 
      name: 'Bahçe Çiçekleri', 
      description: 'Doğal peyzaj efektleri', 
      icon: 'GB',
      beforeImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=400&fit=crop',
      instructions: 'Bahçe ve peyzaj görsellerine çiçek açma efektleri ekler. Doğal alanlar ve bahçe tasarımı için idealdir.'
    }
  ],
  automotive: [
    { 
      id: 'speed-lines', 
      name: 'Hız Çizgileri', 
      description: 'Dinamik hareket efektleri', 
      icon: 'ST',
      beforeImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400&h=400&fit=crop',
      instructions: 'Arabalara hız ve hareket efektleri ekler. Yan profil çekimlerinde en etkili sonuçları verir.'
    },
    { 
      id: 'chrome-shine', 
      name: 'Krom Parlaklığı', 
      description: 'Metalik yüzey ışıltısı', 
      icon: 'TP',
      beforeImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&h=400&fit=crop',
      instructions: 'Arabanın metalik yüzeylerine premium parlaklık ekler. Temiz ve parlak araçlarda en iyi sonuçları verir.'
    },
    { 
      id: 'tire-smoke', 
      name: 'Lastik Dumanı', 
      description: 'Drift ve hızlanma dumanı', 
      icon: 'ST',
      beforeImage: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=400&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&h=400&fit=crop',
      instructions: 'Arabanın tekerleklerinden duman efektleri ekler. Spor araba ve performans çekimleri için idealdir.'
    },
    { 
      id: 'headlight-beam', 
      name: 'Far Işığı', 
      description: 'Güçlü far ışık huzmesi', 
      icon: 'SP',
      beforeImage: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop',
      instructions: 'Arabanın farlarından güçlü ışık huzmeleri çıkarır. Gece çekimlerinde dramatik etki yaratır.'
    },
    { 
      id: 'rain-drops', 
      name: 'Yağmur Damlaları', 
      description: 'Cam üzerinde su efekti', 
      icon: 'RD',
      beforeImage: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=400&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400&h=400&fit=crop',
      instructions: 'Araba camlarına yağmur damlası efektleri ekler. Atmosferik ve duygusal çekimler için mükemmeldir.'
    },
    { 
      id: 'engine-fire', 
      name: 'Motor Ateşi', 
      description: 'Performans ateş efektleri', 
      icon: 'FR',
      beforeImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&h=400&fit=crop',
      instructions: 'Arabanın egzozundan ateş efektleri çıkarır. Performans araçları ve yarış arabalarında kullanılır.'
    }
  ]
};

const ENHANCE_OPTIONS = [
  {
    id: 'upscale',
    name: 'AI Upscale',
    description: 'Enhance resolution up to 4K',
    icon: '🔍'
  },
  {
    id: 'denoise',
    name: 'Noise Reduction',
    description: 'Remove noise and grain',
    icon: '✨'
  },
  {
    id: 'sharpen',
    name: 'Smart Sharpen',
    description: 'Enhance details and clarity',
    icon: '🎯'
  },
  {
    id: 'colorize',
    name: 'AI Colorize',
    description: 'Add colors to black & white images',
    icon: '🎨'
  }
];


interface ProcessedImage {
  id: string;
  originalUrl: string;
  processedUrl: string;
  effect: string;
  enhance?: string;
  timestamp: Date;
  fileName: string;
}

interface ImagePlaygroundProps {
  onNavigateHome?: () => void;
}

export function ImagePlayground({ onNavigateHome }: ImagePlaygroundProps = {}) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);
  const [selectedEnhance, setSelectedEnhance] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingMessage, setProcessingMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageHistory, setImageHistory] = useState<ProcessedImage[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [imageMetadata, setImageMetadata] = useState<{size: number, type: string, dimensions: {width: number, height: number}} | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback((file: File) => {
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    setSelectedImage(file);
    setProcessedUrl(null); // Reset processed image
    setZoomLevel(1); // Reset zoom
    setPanPosition({ x: 0, y: 0 }); // Reset pan
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Calculate aspect ratio and metadata
    const img = new Image();
    img.onload = () => {
      setImageAspectRatio(img.width / img.height);
      setImageMetadata({
        size: file.size,
        type: file.type,
        dimensions: { width: img.width, height: img.height }
      });
    };
    img.src = url;
  }, []);

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      handleImageUpload(file);
    }
  };

  const handleProcess = async () => {
    if (!selectedImage || !previewUrl) return;
    
    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      setProcessingMessage('Preparing request...');
      setProcessingProgress(20);

      const effectObj = selectedCategory
        ? CATEGORY_EFFECTS[selectedCategory as keyof typeof CATEGORY_EFFECTS]?.find(e => e.id === selectedEffect)
        : undefined;
      const enhanceObj = selectedEnhance
        ? ENHANCE_OPTIONS.find(e => e.id === selectedEnhance)
        : undefined;

      const effectName = effectObj?.name || 'Generic Effect';
      const effectDesc = effectObj?.description ? `Details: ${effectObj.description}.` : '';
      const effectGuide = effectObj?.instructions ? `Guidance: ${effectObj.instructions}.` : '';

      const enhanceLine = enhanceObj
        ? `Additionally apply enhancement "${enhanceObj.name}". ${enhanceObj.description}.`
        : '';

      const effectPrompt = [
        `Apply professional-level "${effectName}" to the provided image.`,
        effectDesc,
        effectGuide,
        enhanceLine,
        'Maintain photorealism, correct lighting, perspective and materials. Do not change geometry or identity. Output only the final image.'
      ].filter(Boolean).join(' ');

      setProcessingMessage('Calling Gemini...');
      setProcessingProgress(50);

      const outputDataUrl = await generateEffectImage({
        file: selectedImage,
        effectPrompt,
      });

      setProcessingMessage('Finalizing...');
      setProcessingProgress(90);

      setProcessedUrl(outputDataUrl);

      const processedImage: ProcessedImage = {
        id: Date.now().toString(),
        originalUrl: previewUrl,
        processedUrl: outputDataUrl,
        effect: selectedEffect || '',
        enhance: selectedEnhance || undefined,
        timestamp: new Date(),
        fileName: selectedImage.name
      };
      setImageHistory(prev => [processedImage, ...prev.slice(0, 9)]);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Gemini processing failed');
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
      setProcessingMessage('');
    }
  };

  const handleDownload = () => {
    if (!processedUrl) return;
    
    const link = document.createElement('a');
    link.href = processedUrl;
    link.download = `stellar-ai-processed-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      red: 'border-red-500/50 bg-red-500/10 hover:border-red-500/70 text-red-400',
      blue: 'border-blue-500/50 bg-blue-500/10 hover:border-blue-500/70 text-blue-400',
      purple: 'border-purple-500/50 bg-purple-500/10 hover:border-purple-500/70 text-purple-400',
      yellow: 'border-yellow-500/50 bg-yellow-500/10 hover:border-yellow-500/70 text-yellow-400',
      cyan: 'border-cyan-500/50 bg-cyan-500/10 hover:border-cyan-500/70 text-cyan-400',
      orange: 'border-orange-500/50 bg-orange-500/10 hover:border-orange-500/70 text-orange-400'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.purple;
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Compact Header */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-md flex-shrink-0">
        <div className="px-3 sm:px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <h1 className="text-lg sm:text-xl font-bold tracking-tighter">Image Playground</h1>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-lg border border-white/20 hover:border-white/40 transition-colors duration-300 flex items-center gap-1 sm:gap-2"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="hidden sm:inline">History</span> ({imageHistory.length})
              </button>
            </div>
            <button 
              onClick={onNavigateHome}
              className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-lg border border-white/20 hover:border-white/40 transition-colors duration-300"
            >
              <span className="sm:hidden">←</span>
              <span className="hidden sm:inline">← Back</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Full Height */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* History Sidebar - Desktop */}
        {showHistory && (
          <div className="hidden lg:block w-80 border-r border-white/10 bg-neutral-900/30 flex-shrink-0 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">History</h2>
              {imageHistory.length === 0 ? (
                <p className="text-neutral-400 text-center py-8 text-sm">No processed images yet.</p>
              ) : (
                <div className="space-y-3">
                  {imageHistory.map((item) => (
                    <div key={item.id} className="bg-neutral-800/50 rounded-lg p-3 hover:bg-neutral-800/70 transition-colors cursor-pointer">
                      <img 
                        src={item.processedUrl} 
                        alt={item.fileName}
                        className="w-full h-16 object-cover rounded mb-2"
                      />
                      <p className="text-xs text-neutral-300 truncate">{item.fileName}</p>
                      <p className="text-xs text-neutral-500">{item.effect}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* History Overlay - Mobile */}
        {showHistory && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setShowHistory(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-full max-w-xs bg-neutral-900 border-r border-white/10 overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">History</h2>
                  <button 
                    onClick={() => setShowHistory(false)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {imageHistory.length === 0 ? (
                  <p className="text-neutral-400 text-center py-8 text-sm">No processed images yet.</p>
                ) : (
                  <div className="space-y-3">
                    {imageHistory.map((item) => (
                      <div key={item.id} className="bg-neutral-800/50 rounded-lg p-3 hover:bg-neutral-800/70 transition-colors cursor-pointer">
                        <img 
                          src={item.processedUrl} 
                          alt={item.fileName}
                          className="w-full h-16 object-cover rounded mb-2"
                        />
                        <p className="text-xs text-neutral-300 truncate">{item.fileName}</p>
                        <p className="text-xs text-neutral-500">{item.effect}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Canvas Area */}
        <div className="flex-1 flex">
          
          {/* Center Canvas */}
          <div className="flex-1 flex flex-col p-2 sm:p-4">
            

            {/* Main Canvas Content */}
            <div className="flex-1 flex flex-col lg:flex-row gap-2 sm:gap-4 min-h-0">
              
              {/* Image Canvas - Center */}
              <div className="flex-1 bg-neutral-900/30 rounded-lg border border-white/10 p-4 flex flex-col relative overflow-hidden" 
                   style={{ backgroundImage: 'radial-gradient(circle, #374151 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                {!previewUrl ? (
                  selectedEffect && selectedCategory ? (
                    /* Effect Preview Mode */
                    <div className="flex-1 flex flex-col">
                      {/* Effect Header */}
                      <div className="mb-4 text-center">
                        <h2 className="text-lg sm:text-xl font-semibold mb-2 flex items-center justify-center">
                          <span className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-purple-500/20 border border-purple-500/50 rounded text-xs sm:text-sm font-bold mr-2 sm:mr-3">
                            {CATEGORY_EFFECTS[selectedCategory as keyof typeof CATEGORY_EFFECTS]?.find(e => e.id === selectedEffect)?.icon}
                          </span>
                          {CATEGORY_EFFECTS[selectedCategory as keyof typeof CATEGORY_EFFECTS]?.find(e => e.id === selectedEffect)?.name}
                        </h2>
                        <p className="text-neutral-400 text-xs sm:text-sm">
                          {CATEGORY_EFFECTS[selectedCategory as keyof typeof CATEGORY_EFFECTS]?.find(e => e.id === selectedEffect)?.description}
                        </p>
                      </div>

                      {/* Before/After Example */}
                      <div className="flex-1 bg-neutral-950 rounded-lg p-3 sm:p-6 mb-4 relative">
                        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-6 text-center">Önce vs Sonra</h3>
                        
                        {/* Side by Side Images - Portrait Format */}
                        <div className="flex items-center justify-center gap-2 sm:gap-4 lg:gap-6 h-48 sm:h-64 lg:h-80">
                          {/* Before Image */}
                          <div className="w-32 sm:w-40 lg:w-48 h-full relative group">
                            <div className="absolute top-2 left-2 bg-red-500/90 text-white px-2 py-1 rounded text-xs font-medium z-10">
                              ÖNCE
                            </div>
                            <img
                              src={CATEGORY_EFFECTS[selectedCategory as keyof typeof CATEGORY_EFFECTS]?.find(e => e.id === selectedEffect)?.beforeImage || ''}
                              alt="Efekt öncesi"
                              className="w-full h-full object-cover rounded-lg border border-white/10 group-hover:border-red-500/50 transition-all duration-300"
                            />
                          </div>

                          {/* Arrow and Upload Button */}
                          <div className="flex flex-col items-center gap-2 sm:gap-4 px-1 sm:px-2 lg:px-4">
                            {/* Arrow */}
                            <div className="flex items-center gap-1 sm:gap-2">
                              <div className="w-4 sm:w-6 lg:w-8 h-0.5 bg-gradient-to-r from-red-500 to-green-500"></div>
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              <div className="w-4 sm:w-6 lg:w-8 h-0.5 bg-gradient-to-r from-red-500 to-green-500"></div>
                            </div>
                            
                            {/* Upload Button */}
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg font-medium text-xs sm:text-sm hover:brightness-110 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 whitespace-nowrap"
                            >
                              <svg className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <span className="hidden sm:inline">Görsel Yükle</span>
                              <span className="sm:hidden">Yükle</span>
                            </button>
                          </div>

                          {/* After Image */}
                          <div className="w-32 sm:w-40 lg:w-48 h-full relative group">
                            <div className="absolute top-2 left-2 bg-green-500/90 text-white px-2 py-1 rounded text-xs font-medium z-10">
                              SONRA
                            </div>
                            <img
                              src={CATEGORY_EFFECTS[selectedCategory as keyof typeof CATEGORY_EFFECTS]?.find(e => e.id === selectedEffect)?.afterImage || ''}
                              alt="Efekt sonrası"
                              className="w-full h-full object-cover rounded-lg border border-white/10 group-hover:border-green-500/50 transition-all duration-300"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Instructions */}
                      <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-3 sm:p-4">
                        <h4 className="font-semibold mb-2 text-blue-300 flex items-center text-sm sm:text-base">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Kullanım Talimatları
                        </h4>
                        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                          {CATEGORY_EFFECTS[selectedCategory as keyof typeof CATEGORY_EFFECTS]?.find(e => e.id === selectedEffect)?.instructions}
                        </p>
                      </div>

                      {/* File Format Info */}
                      <div className="text-center mt-2">
                        <p className="text-xs text-neutral-500">Desteklenen formatlar: JPG, PNG, WEBP (max 10MB)</p>
                      </div>
                    </div>
                  ) : (
                    /* Default Upload Area */
                    <div
                      className={`flex-1 border-2 border-dashed rounded-lg text-center transition-all duration-300 cursor-pointer flex items-center justify-center relative ${
                        dragActive 
                          ? 'border-purple-500 bg-purple-500/10' 
                          : 'border-white/20 hover:border-white/40'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="px-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center">
                          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <p className="text-base sm:text-lg font-medium mb-2">Drop your image here</p>
                        <p className="text-neutral-400 text-xs sm:text-sm">or click to browse files</p>
                        <p className="text-neutral-500 text-xs mt-2">Supports: JPG, PNG, WEBP (max 10MB)</p>
                        {!selectedEffect && (
                          <p className="text-purple-400 text-xs sm:text-sm mt-3 sm:mt-4">Önce bir efekt seçin</p>
                        )}
                      </div>
                    </div>
                  )
                ) : (
                  <div className="flex-1 flex flex-col">
                    {/* Before/After Comparison if processed */}
                    {processedUrl && previewUrl ? (
                      <div className="flex-1 bg-neutral-950 rounded-lg p-4 flex items-center justify-center">
                        <div className="w-full max-w-2xl h-96">
                          <ImageComparison className="h-full w-full rounded-lg overflow-hidden">
                            <ImageComparisonImage
                              src={previewUrl}
                              alt="Original image"
                              position="left"
                            />
                            <ImageComparisonImage
                              src={processedUrl}
                              alt="Processed image"
                              position="right"
                            />
                            <ImageComparisonSlider className="bg-purple-500">
                              <div className="h-12 w-12 rounded-full bg-purple-500 shadow-lg flex items-center justify-center text-white ring-4 ring-black/50">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="m9 17-5-5 5-5"/><path d="m15 17 5-5-5-5"/>
                                </svg>
                              </div>
                            </ImageComparisonSlider>
                          </ImageComparison>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 relative overflow-hidden">
                        <div 
                          className="w-full h-full flex items-center justify-center overflow-hidden relative"
                          style={{ 
                            transform: `translate(${panPosition.x}px, ${panPosition.y}px)` 
                          }}
                        >
                          <div className="relative group">
                            <img 
                              src={previewUrl} 
                              alt="Preview" 
                              className="rounded-lg shadow-2xl transition-transform duration-200 cursor-move select-none bg-white"
                              style={{ 
                                transform: `scale(${zoomLevel})`,
                                maxWidth: '400px',
                                maxHeight: '400px',
                                width: 'auto',
                                height: 'auto',
                                objectFit: 'contain'
                              }}
                              draggable={false}
                              onMouseDown={(e) => {
                                const startX = e.clientX - panPosition.x;
                                const startY = e.clientY - panPosition.y;
                                
                                const handleMouseMove = (e: MouseEvent) => {
                                  setPanPosition({
                                    x: e.clientX - startX,
                                    y: e.clientY - startY
                                  });
                                };
                                
                                const handleMouseUp = () => {
                                  document.removeEventListener('mousemove', handleMouseMove);
                                  document.removeEventListener('mouseup', handleMouseUp);
                                };
                                
                                document.addEventListener('mousemove', handleMouseMove);
                                document.addEventListener('mouseup', handleMouseUp);
                              }}
                            />
                            
                            {/* Image Controls Around Image */}
                            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <button
                                onClick={handleZoomIn}
                                className="p-2 bg-black/80 hover:bg-black/90 rounded-lg transition-colors duration-300 backdrop-blur-sm"
                                title="Zoom In"
                              >
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              </button>
                              <button
                                onClick={handleZoomOut}
                                className="p-2 bg-black/80 hover:bg-black/90 rounded-lg transition-colors duration-300 backdrop-blur-sm"
                                title="Zoom Out"
                              >
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                                </svg>
                              </button>
                              <button
                                onClick={handleResetZoom}
                                className="p-2 bg-black/80 hover:bg-black/90 rounded-lg transition-colors duration-300 backdrop-blur-sm"
                                title="Reset Zoom"
                              >
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                              </button>
                              <button
                                onClick={() => {
                                  setPreviewUrl(null);
                                  setSelectedImage(null);
                                  setProcessedUrl(null);
                                  setSelectedEffect(null);
                                  setSelectedEnhance(null);
                                  setImageAspectRatio(null);
                                  setImageMetadata(null);
                                  setZoomLevel(1);
                                  setPanPosition({ x: 0, y: 0 });
                                }}
                                className="p-2 bg-red-500/80 hover:bg-red-500/90 rounded-lg transition-colors duration-300 backdrop-blur-sm"
                                title="Remove Image"
                              >
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                            
                            {/* Zoom Level Indicator */}
                            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black/80 rounded-full text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                              {Math.round(zoomLevel * 100)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Bottom Control Bar */}
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 py-2 px-3 text-sm border border-white/20 rounded-lg hover:border-white/40 transition-colors duration-300"
                      >
                        Change Image
                      </button>
                      {processedUrl && (
                        <button
                          onClick={handleDownload}
                          className="py-2 px-3 text-sm bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-300 flex items-center gap-2"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download
                        </button>
                      )}
                      {imageMetadata && (
                        <div className="text-xs text-neutral-400 flex items-center px-2">
                          {imageMetadata.dimensions.width}×{imageMetadata.dimensions.height} • {formatFileSize(imageMetadata.size)}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>

              {/* Right Sidebar - Effects & Controls */}
              <div className="w-full lg:w-80 bg-neutral-900/30 rounded-lg border border-white/10 p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 overflow-y-auto flex-shrink-0 max-h-64 lg:max-h-full">
                
                {/* Process Button */}
                {(selectedEffect || selectedEnhance) && selectedImage && (
                  <div className="bg-neutral-800/50 rounded-lg p-4">
                    <button
                      onClick={handleProcess}
                      disabled={isProcessing}
                      className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg font-semibold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      {isProcessing ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                            {processingMessage}
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-1">
                            <div 
                              className="bg-gradient-to-r from-purple-400 to-indigo-400 h-1 rounded-full transition-all duration-300"
                              style={{ width: `${processingProgress}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-purple-300">{processingProgress}%</div>
                        </div>
                      ) : (
                        'Apply AI Effects'
                      )}
                    </button>
                    
                    {(selectedEffect || selectedEnhance) && (
                      <div className="mt-3 p-2 bg-white/5 rounded text-xs text-neutral-300">
                        {selectedEffect && selectedCategory && CATEGORY_EFFECTS[selectedCategory as keyof typeof CATEGORY_EFFECTS]?.find(e => e.id === selectedEffect)?.name}
                        {selectedEffect && selectedEnhance && ' + '}
                        {selectedEnhance && ENHANCE_OPTIONS.find(e => e.id === selectedEnhance)?.name}
                      </div>
                    )}
                  </div>
                )}

                {!selectedCategory ? (
                  /* Effect Categories */
                  <div className="bg-neutral-800/50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3">Efekt Kategorileri</h3>
                    <div className="space-y-2">
                      {EFFECT_CATEGORIES.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full p-3 rounded-lg border transition-all duration-300 text-left hover:border-white/30 ${
                            getColorClasses(category.color).replace('border-', 'hover:border-').replace('/50', '/30')
                          } border-white/10 bg-white/5`}
                        >
              <div className="flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-white/10 border border-white/20 rounded text-sm font-bold mr-3">
                  {category.icon}
                </span>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm">{category.name}</h4>
                            </div>
                            <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Category Effects */
                  <div className="bg-neutral-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold">
                        {EFFECT_CATEGORIES.find(c => c.id === selectedCategory)?.name}
                      </h3>
                      <button
                        onClick={() => {
                          setSelectedCategory(null);
                          setSelectedEffect(null);
                        }}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="Geri dön"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    </div>
                    <div className="space-y-2">
                      {CATEGORY_EFFECTS[selectedCategory as keyof typeof CATEGORY_EFFECTS]?.map((effect) => (
                        <button
                          key={effect.id}
                          onClick={() => setSelectedEffect(effect.id === selectedEffect ? null : effect.id)}
                          className={`w-full p-3 rounded-lg border transition-all duration-300 text-left ${
                            selectedEffect === effect.id 
                              ? 'border-purple-500/50 bg-purple-500/10 hover:border-purple-500/70 text-purple-400'
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                          }`}
                        >
            <div className="flex items-center">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-white/10 border border-white/20 rounded text-xs font-bold mr-2">
                {effect.icon}
              </span>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm">{effect.name}</h4>
                              <p className="text-xs text-neutral-400 truncate">{effect.description}</p>
                            </div>
                            {selectedEffect === effect.id && (
                              <div className="w-4 h-4 rounded-full bg-current flex items-center justify-center flex-shrink-0">
                                <svg className="w-2 h-2 text-black" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Image Enhancement */}
                <div className="bg-neutral-800/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Enhancement</h3>
                  <div className="space-y-2">
                    {ENHANCE_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedEnhance(option.id === selectedEnhance ? null : option.id)}
                        className={`w-full p-3 rounded-lg border transition-all duration-300 text-left ${
                          selectedEnhance === option.id 
                            ? 'border-green-500/50 bg-green-500/10 hover:border-green-500/70 text-green-400'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{option.icon}</span>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">{option.name}</h4>
                            <p className="text-xs text-neutral-400 truncate">{option.description}</p>
                          </div>
                          {selectedEnhance === option.id && (
                            <div className="w-4 h-4 rounded-full bg-current flex items-center justify-center flex-shrink-0">
                              <svg className="w-2 h-2 text-black" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && previewUrl && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-full max-h-full flex items-center justify-center">
            <img 
              src={previewUrl} 
              alt="Fullscreen Preview" 
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {imageMetadata && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 px-4 py-2 rounded-lg">
                <p className="text-sm text-neutral-300">
                  {imageMetadata.dimensions.width} × {imageMetadata.dimensions.height} • {formatFileSize(imageMetadata.size)}
                </p>
              </div>
            )}
          </div>
          {/* Click outside to close */}
          <div 
            className="absolute inset-0 -z-10" 
            onClick={() => setIsFullscreen(false)}
          ></div>
        </div>
      )}
    </div>
  );
}
