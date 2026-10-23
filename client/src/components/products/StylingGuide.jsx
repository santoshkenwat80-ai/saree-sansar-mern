import { useState } from "react";
import {
  Sparkles,
  Layers,
  Check,
  CheckCircle2,
  Copy,
  Crown,
  Lightbulb,
  Scissors,
  ShieldAlert,
  Printer,
  Compass,
  Palette,
  Eye,
  Sliders
} from "lucide-react";
import { Button } from "../common/Button";
import toast from "react-hot-toast";
export const StylingGuide = ({ product }) => {
  const [activeTab, setActiveTab] = useState("drape");
  const [selectedDrape, setSelectedDrape] = useState("nivi");
  const [selectedOccasion, setSelectedOccasion] = useState(
    product.occasion.toLowerCase().includes("wedding") || product.occasion.toLowerCase().includes("bridal") ? "bridal" : product.occasion.toLowerCase().includes("festive") ? "festive" : product.occasion.toLowerCase().includes("pooja") ? "pooja" : "festive"
  );
  const [completedSteps, setCompletedSteps] = useState({});
  const [showPrintModal, setShowPrintModal] = useState(false);
  const fabricLower = (product.fabric || "").toLowerCase();
  const isHeavySilk = fabricLower.includes("banarasi") || fabricLower.includes("kanjivaram") || fabricLower.includes("pure silk") || fabricLower.includes("tussar");
  const isSheerFlowing = fabricLower.includes("organza") || fabricLower.includes("chiffon") || fabricLower.includes("georgette") || fabricLower.includes("chanderi");
  const fabricWeightLabel = isHeavySilk ? "Royal Heavy Silk (800g - 1100g)" : isSheerFlowing ? "Featherlight Sheer / Gossamer (350g - 500g)" : "Mid-Weight Artisanal Weave (550g - 750g)";
  const petticoatAdvice = isHeavySilk ? "Pure Cotton Inskirt with reinforced waistband or Sturdy Satin Petticoat to bear the weight of heavy zari." : fabricLower.includes("organza") ? "Tone-on-tone Shimmer Satin Inskirt (seamless mermaid cut) to enhance translucent luster without bunched folds." : "Mermaid silhouette shapewear or smooth crepe petticoat for fluid crease-free movement.";
  const pleatingHold = isHeavySilk ? "Crisp, structured pleats that hold geometric shape effortlessly with hand-pressing." : fabricLower.includes("organza") ? "Voluminous sculptural pleats. Make fewer, broader pleats (4 to 5) so they stay flat and graceful." : "Fluid cascading pleats. Secure with mini fabric-safe safety pins along the inner side.";
  const drapeStyles = {
    nivi: {
      id: "nivi",
      name: "Royal Nivi Drape",
      tagline: "The timeless, stately drape of Indian royalty and modern celebrations.",
      idealFor: "Weddings, Formal Banquets, Receptions, and Festive Evenings",
      difficulty: "Beginner",
      pleatWidth: isHeavySilk ? "5.5 to 6 inches broad" : "3 to 4 inches compact",
      steps: [
        {
          title: "Step 1: The Foundation Round",
          description: "Put on your chosen heels or footwear first. Begin at the right navel, tucking the plain end firmly into the petticoat waistband, taking one complete anti-clockwise turn, maintaining a uniform floor-brushing length all around.",
          proTip: "Never tuck barefoot if you plan to wear heels later; the hemline will rise awkwardly."
        },
        {
          title: "Step 2: Pallu Measurement & Shoulder Sweep",
          description: "Take the opposite zari pallu end, bring it under your right arm and drape it across your chest over the left shoulder. Allow the pallu to fall gracefully to your calf or knee level (minimum 36 inches for royal grace).",
          proTip: "Pin temporarily to the blouse shoulder while you pleat the waist."
        },
        {
          title: "Step 3: Creating Crisp Waist Pleats",
          description: `Gather 6 to 8 uniform front pleats measuring ${isHeavySilk ? "5.5 to 6 inches" : "3.5 inches"}. Shake gently to ensure all pleats align evenly from waist to hem. Hand-press the fold lines.`,
          proTip: "Keep the outermost first pleat slightly wider by half an inch so it blankets the inner pleats flawlessly."
        },
        {
          title: "Step 4: Navel Anchoring",
          description: "Tuck the pleated bundle snugly into your waistband, directly below the navel. Ensure all pleats point neatly towards your left leg.",
          proTip: "Anchor the pleated bunch through the petticoat with a pearl-headed safety pin from the inside."
        },
        {
          title: "Step 5: Shoulder Pallu Fan & Finishing Pin",
          description: "Pleat the shoulder pallu in 3 to 4 neat folds or let it fall as a sweeping open pallu. Pin from the inside behind the shoulder seam so the pin remains completely invisible.",
          proTip: "A drop of clear tape or a tiny button on the safety pin head prevents metallic zari threads from snagging."
        }
      ],
      expertSecret: "For pure zari silks, press each pleat firmly between your palms for 5 seconds \u2014 natural silk retains hand-heat and sets into crisp heirloom perfection without ironing."
    },
    seedha: {
      id: "seedha",
      name: "Seedha Pallu (Royal Gujarati / Avadhi)",
      tagline: "Showcases the master artisan\u2019s intricate zari pallu across the front bodice.",
      idealFor: "Bridal ceremonies, Grand Sangeets, and North/Western Indian rituals",
      difficulty: "Intermediate",
      pleatWidth: "5 inches uniform",
      steps: [
        {
          title: "Step 1: Base Tuck & Circle",
          description: "Perform the regular foundation tuck at the navel, circling anti-clockwise until you return to the center front."
        },
        {
          title: "Step 2: Back-to-Front Pallu Sweep",
          description: "Instead of draping over the left shoulder, take the pallu from behind your back and bring it forward over your right shoulder so the grand ornate pallu cascades down your chest.",
          proTip: "Ensure the grandest border motif faces outward on your bust line."
        },
        {
          title: "Step 3: Waist Pleats Tuck",
          description: "Make 7 to 8 front pleats and tuck them into the center navel. The pleats should turn towards the right side."
        },
        {
          title: "Step 4: Fan Front Pallu & Corner Tuck",
          description: "Spread the front-facing pallu diagonally across the chest. Take the left corner of the pallu and tuck or pin it neatly to the left waistline behind your hip.",
          proTip: "Use an ornate brooch or Kamarbandh to secure the left waist anchor."
        },
        {
          title: "Step 5: Right Shoulder Anchoring",
          description: "Pin the gathered pleats onto the right shoulder of the blouse, allowing the rest of the pallu to fall like a royal tapestry in front."
        }
      ],
      expertSecret: "This drape is unbeatable when your saree features an antique gold or silver zardosi pallu \u2014 it brings 100% of the weaver\u2019s artistry front and center."
    },
    bengali: {
      id: "bengali",
      name: "Bengali Atpoure Heritage Drape",
      tagline: "Iconic, poetic drape with broad box pleats and dual-shoulder pallu placement.",
      idealFor: "Durga Puja, Morning Pujas, Sindoor Khela, and Cultural Festivals",
      difficulty: "Intermediate",
      pleatWidth: "Broad box pleats (8 to 9 inches)",
      steps: [
        {
          title: "Step 1: Clockwise Foundation Tuck",
          description: "Start tucking at the right side of the waist, wrap clockwise once around to the left hip, then right hip to establish the baseline."
        },
        {
          title: "Step 2: Wide Stately Box Pleats",
          description: "Gather large, broad box pleats (only 2 to 3 large pleats) spanning the entire width of your front torso, tucking them flat at the navel.",
          proTip: "Box pleats give a majestic straight-line silhouette that flatters all body types."
        },
        {
          title: "Step 3: Left Shoulder Pallu Throw",
          description: "Take the pallu, gather into soft pleats and rest over the left shoulder, letting it fall freely down the back to the knee level."
        },
        {
          title: "Step 4: The Iconic Right Shoulder Swag",
          description: "Reach back, take the ornate corner of the hanging pallu, bring it forward under your right arm and fling it over your right shoulder.",
          proTip: "Attach a heavy vintage silver key bunch (chabi guccha) or tassel to the corner for authentic imperial Bengali poise."
        },
        {
          title: "Step 5: Final Grace Balance",
          description: "Secure both shoulder folds with discreet mini safety pins. Ensure the front box pleats lie completely flat without puffing."
        }
      ],
      expertSecret: "Pair this drape with a red-and-white shankha-pola bangle stack and a traditional circular red bindi for unforgettable elegance."
    },
    belted: {
      id: "belted",
      name: "Modern Belted & Cape Silhouette",
      tagline: "Contemporary runway glamour meets classical heritage textiles.",
      idealFor: "Cocktail Receptions, Sangeet Nights, Destination Weddings, and Galas",
      difficulty: "Beginner",
      pleatWidth: "3.5 inches sharp",
      steps: [
        {
          title: "Step 1: Slim Mermaid Silhouette Tuck",
          description: "Wear a shapewear inskirt. Tuck tightly at the waist for a sculpted, figure-hugging profile around the hips."
        },
        {
          title: "Step 2: High-Waist Front Pleats",
          description: "Form 5 to 6 crisp pleats and tuck slightly higher than normal at the natural waistline."
        },
        {
          title: "Step 3: Narrow Accordion Shoulder Pleats",
          description: "Fold the pallu into narrow, razor-sharp 2-inch accordion pleats. Pin tightly at the shoulder so it sits like a sleek sash."
        },
        {
          title: "Step 4: Kamarbandh / Belt Placement",
          description: "Fasten an antique gold temple belt, zardozi embroidered fabric belt, or sleek metallic belt snugly around your natural waist over both the saree and the pallu.",
          proTip: "The belt locks the entire drape in place, giving you 100% hands-free freedom to dance without adjusting."
        },
        {
          title: "Step 5: Pallu Fall Calibration",
          description: "Let the trailing end of the pallu cascade cleanly down your back like a modern royal cape."
        }
      ],
      expertSecret: "Belted drapes visually elongate the torso and cinch the waist, making heavy silk weaves feel as effortless and light as couture gowns."
    },
    open: {
      id: "open",
      name: "Flowing Waterfall / Open Pallu",
      tagline: "Breathtaking fluid drape designed to display gossamer sheers and intricate all-over jaal.",
      idealFor: "Intimate Dinners, Red Carpets, Sheer Organza & Georgette sarees",
      difficulty: "Beginner",
      pleatWidth: "4 inches relaxed",
      steps: [
        {
          title: "Step 1: Seamless Base Tuck",
          description: "Perform the circular base tuck with a seamless inner petticoat in matching tone."
        },
        {
          title: "Step 2: Gentle Waist Pleating",
          description: "Make 5 to 6 relaxed front pleats. Tuck cleanly into the center waistband."
        },
        {
          title: "Step 3: Drape Pallu Open Over Shoulder",
          description: "Instead of pleating the pallu, leave it completely unfolded and drape it over your left shoulder so it cascades across your forearm.",
          proTip: "For sheer organza or georgette, let the transparency show the waist and blouse craft."
        },
        {
          title: "Step 4: Wrist or Brooch Anchor",
          description: "Use a subtle safety pin to attach the pallu to your left shoulder blouse seam. Gather the corner lightly in your left hand or rest it over your bent arm."
        },
        {
          title: "Step 5: Torso Cowl Adjustment",
          description: "Smooth the fabric across your torso to form gentle natural diagonal cowl lines."
        }
      ],
      expertSecret: "Never iron organza with steam \u2014 dry pressing through a cotton muslin cloth protects the crisp sculptural flare that makes open pallu organza so ethereal."
    }
  };
  const occasionPairings = {
    bridal: {
      id: "bridal",
      label: "Bridal & Royal Wedding",
      vibe: "Opulent, heirloom imperial glory with antique real gold accents",
      badge: "Royal Heirloom Trousseau",
      jewelry: {
        neckwear: "Antique Temple Gold choker layered with a long Guttapusalu or Jadau Kundan Raani Haar.",
        earrings: "Heavy peacock jhumkas with 3-tier ear-chains (kaan-phool) extending into the hair.",
        bangles: "Pair of broad carved gold kadas flanked by ruby-studded pacchi glass bangles.",
        waistHead: "Antique oddiyanam / Kamarbandh with Lakshmi motif, topped with pearl mathapatti & nath."
      },
      blouse: {
        neckline: "Sweetheart or Royal Queen Anne neckline with heavy hand-zardozi border along the collar.",
        sleeves: "Elbow-length maggam embroidered sleeves with matching border zari piping.",
        contrastRecommendation: product.color.toLowerCase().includes("red") || product.color.toLowerCase().includes("crimson") ? "Deep Forest Emerald or Antique Gold tissue raw silk contrast" : "Imperial Crimson Velvet or Rose Ruby contrast",
        fabricNote: "Pure raw silk or heavy brocade with breathable pure cotton lining."
      },
      accessories: {
        footwear: "Handcrafted zardozi-embroidered raw silk block heels (2.5 inch) for all-day royal posture.",
        handbag: "Velvet bridal potli with pearls and handcrafted zardozi latkans.",
        fragrance: "Pure Indian Gulab (Damask Rose) attar layered with warm royal Oudh."
      },
      beauty: {
        hair: "Classic low bridal bun circled with 3 dense rings of fresh fragrant Mogra (Jasmine) gajra.",
        makeup: "Flawless velvet-matte complexion, deep kohled eyes with winged kajal, and classic royal vermillion lipstick.",
        bindi: "Traditional handcrafted round velvet bindi in deep bridal red, accented with subtle chandan dots."
      }
    },
    festive: {
      id: "festive",
      label: "Festive Celebrations",
      vibe: "Vibrant celebratory sparkle for Diwali, Navratri, Pongal, and Eid",
      badge: "Celebratory Festive Radiance",
      jewelry: {
        neckwear: "Polki crescent moon choker with emerald bead drops or Meenakari Hasli necklace.",
        earrings: "Statement Chandbalis with pearl tassels that sway with motion.",
        bangles: "Stack of metallic gold bangles interspaced with thread-wrapped colorful bangles.",
        waistHead: "Delicate floral maang tikka and a sleek gold chain kamarbandh."
      },
      blouse: {
        neckline: "Classic deep round back with handmade potli dori latkans; front jewel neck or broad U.",
        sleeves: "Sleek elbow-length or cap sleeves with delicate gota-patti accents.",
        contrastRecommendation: "Warm Mustard Ochre, Royal Indigo, or Rani Pink depending on your base shade.",
        fabricNote: "Chanderi silk or Benarasi brocade with soft cotton voil lining."
      },
      accessories: {
        footwear: "Hand-embroidered Rajasthani mojaris or rose-gold ankle-strap block heels.",
        handbag: "Raw silk envelope clutch with antique brocade flap.",
        fragrance: "Fresh blooming Raat ki Rani (Night-blooming Jasmine) or Kewra essence."
      },
      beauty: {
        hair: "Soft romantic waves swept to one side or half-up twisted braid with fresh baby\u2019s breath flowers.",
        makeup: "Warm golden shimmer on eyelids, flushed peach cheeks, and a luscious berry-rose lip shade.",
        bindi: "Delicate teardrop-shaped marron bindi or crystal accent."
      }
    },
    reception: {
      id: "reception",
      label: "Evening Reception & Cocktail",
      vibe: "Modern aristocracy, sleek silhouettes, and luminous evening glow",
      badge: "Couture Evening Glamour",
      jewelry: {
        neckwear: "Contemporary Diamond-look CZ collar, Victorian polki choker, or layered baroque pearl strands.",
        earrings: "Geometric shoulder-duster earrings or dramatic diamond ear-cuffs.",
        bangles: "Single statement cocktail cuff on the left wrist; sleek diamond tennis bracelet.",
        waistHead: "Minimalist metallic architectural waist belt (skip head jewelry for modern chic)."
      },
      blouse: {
        neckline: "Architectural plunge neckline, deep sweetheart, or halter neck cut with clean edges.",
        sleeves: "Sleeveless with razor-thin piping or full-length sheer organza bishop sleeves.",
        contrastRecommendation: "Monochromatic tone-on-tone with shimmering metallic sequins or Champagne Gold.",
        fabricNote: "Silk satin, imported organza, or structured metallic brocade."
      },
      accessories: {
        footwear: "Strappy metallic stiletto heels or mirror-work platform sandals.",
        handbag: "Structured crystal-encrusted acrylic minaudi\xE8re or metallic clutch.",
        fragrance: "Sophisticated Amber, Bergamot, and Mysore Sandalwood notes."
      },
      beauty: {
        hair: "Sleek middle-parted glass-hair straight blowout or modern high textured ponytail.",
        makeup: "Dramatic smoky winged eyeliner, champagne glass highlighter on cheekbones, and nudish-brown glossy lip.",
        bindi: "Microscopic black velvet bindi or modern bare forehead."
      }
    },
    pooja: {
      id: "pooja",
      label: "Traditional Pooja & Rituals",
      vibe: "Sacred, serene, pure, and spiritually uplifting traditional simplicity",
      badge: "Sacred Temple Heritage",
      jewelry: {
        neckwear: "Traditional temple coin necklace (Kasu Mala), Mangalsutra, or light Nakshi pendant.",
        earrings: "Simple gold jhumkas or classic 7-stone diamond studs (Vaddanam studs).",
        bangles: "Pure gold thin bangles paired with green glass bangles (considered auspicious).",
        waistHead: "Delicate gold waist chain (optional). Keep jewelry comfortable for sitting on the floor."
      },
      blouse: {
        neckline: "Conservative high boat neck or modest U-neckline with piping.",
        sleeves: "Comfortable three-quarter sleeves or traditional 5-inch length sleeves.",
        contrastRecommendation: "Auspicious Turmeric Yellow, Vermillion Sindoor Red, or Tulsi Green.",
        fabricNote: "Breathable pure handloom cotton or soft mulberry silk."
      },
      accessories: {
        footwear: "Slip-on leather Kolhapuris that are easy to remove at temple entrances.",
        handbag: "Artisanal hand-woven jute & silk tote or simple fabric potli bag.",
        fragrance: "Pure divine Chandan (Mysore Sandalwood) oil or sacred camphor & lotus note."
      },
      beauty: {
        hair: "Traditional neat oil-smoothed braid tied with red tassel or small fresh jasmine string.",
        makeup: "Minimal glowing skin, natural kajal in waterline, and soft tinted rose balm.",
        bindi: "Authentic crimson kumkum or yellow turmeric tilak at the center of the brow."
      }
    },
    day: {
      id: "day",
      label: "Intimate Soir\xE9e / Day Elegance",
      vibe: "Effortless, breezy daytime grace for lunches, art exhibits, and tea parties",
      badge: "Effortless Daytime Chic",
      jewelry: {
        neckwear: "Oxidized silver choker, layered freshwater pearls, or raw uncut stone collar.",
        earrings: "Silver tribal jhumkas or baroque pearl drops.",
        bangles: "Stack of rustic silver oxidized bangles or handcrafted terracotta bracelets.",
        waistHead: "Keep forehead and waist free for a clean, contemporary silhouette."
      },
      blouse: {
        neckline: "Collar shirt blouse, modern crop-top silhouette, or square neck.",
        sleeves: "Elbow-length with button cuffs or loose kimono-inspired sleeves.",
        contrastRecommendation: "Pastel Mint, Powder Blue, Ivory Cream, or Soft Blush Pink.",
        fabricNote: "Linen silk, khadi cotton, or lightweight Chanderi."
      },
      accessories: {
        footwear: "Flat leather slingback sandals or cushioned pointed-toe mules.",
        handbag: "Hand-painted kalamkari crossbody or wicker basket clutch with silk scarf.",
        fragrance: "Crisp green tea, vetiver (khus), and neroli notes."
      },
      beauty: {
        hair: "Casual messy low bun secured with a tortoiseshell claw clip or wooden hairpin.",
        makeup: "Tinted serum sunscreen, brushed-up feathery brows, soft coral lip-and-cheek tint.",
        bindi: "Tiny maroon pinhead bindi."
      }
    }
  };
  const currentDrape = drapeStyles[selectedDrape];
  const currentOccasion = occasionPairings[selectedOccasion];
  const handleCopyFormula = () => {
    const formulaText = `\u2728 SAREE SANSAR STYLING BLUEPRINT \u2728
Saree: ${product.name} (${product.fabric} - ${product.color})
Occasion: ${currentOccasion.label} (${currentOccasion.vibe})
Recommended Drape: ${currentDrape.name} (Pleat Width: ${currentDrape.pleatWidth})
Jewelry:
  \u2022 Neckwear: ${currentOccasion.jewelry.neckwear}
  \u2022 Earrings: ${currentOccasion.jewelry.earrings}
  \u2022 Bangles: ${currentOccasion.jewelry.bangles}
  \u2022 Accent: ${currentOccasion.jewelry.waistHead}
Blouse Pairing:
  \u2022 Neckline: ${currentOccasion.blouse.neckline}
  \u2022 Sleeves: ${currentOccasion.blouse.sleeves}
  \u2022 Contrast: ${currentOccasion.blouse.contrastRecommendation}
Footwear: ${currentOccasion.accessories.footwear}
Bag: ${currentOccasion.accessories.handbag}
Hair & Makeup: ${currentOccasion.beauty.hair} | ${currentOccasion.beauty.makeup}
Pro Secret: "${currentDrape.expertSecret}"
Curated by Saree Sansar Heritage Styling Studio`;
    navigator.clipboard.writeText(formulaText);
    toast.success("Complete Styling Blueprint copied to clipboard! \u2728", {
      duration: 3500,
      icon: "\u{1F48E}"
    });
  };
  const toggleStep = (index) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round(completedCount / currentDrape.steps.length * 100);
  return <section id="styling-guide" className="mt-16 pt-12 border-t border-stone-200">
      {
    /* Section Header */
  }
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#881930] uppercase tracking-widest mb-1.5">
            <Crown className="w-4 h-4 text-[#a07817]" />
            <span>Artisanal Heritage Masterclass</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
            Styling &amp; Draping Guide
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            Bespoke draping techniques engineered for <strong className="text-stone-900 font-semibold">{product.fabric}</strong> and exquisite accessory harmonies curated for every grand occasion.
          </p>
        </div>

        {
    /* Action Buttons */
  }
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
    variant="outline"
    size="sm"
    onClick={handleCopyFormula}
    className="text-xs border-stone-300 hover:border-[#881930] hover:text-[#881930]"
    title="Copy look formula to clipboard"
  >
            <Copy className="w-3.5 h-3.5 mr-1.5" />
            <span>Copy Look Formula</span>
          </Button>
          <Button
    variant="secondary"
    size="sm"
    onClick={() => setShowPrintModal(true)}
    className="text-xs"
  >
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            <span>View Style Card</span>
          </Button>
        </div>
      </div>

      {
    /* Main Container Card */
  }
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {
    /* Navigation Tabs */
  }
        <div className="flex border-b border-stone-200 bg-stone-50/70 p-2 gap-2 overflow-x-auto">
          <button
    onClick={() => setActiveTab("drape")}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${activeTab === "drape" ? "bg-white text-[#6b1426] shadow-xs border border-stone-200" : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/60"}`}
  >
            <Layers className="w-4 h-4 text-[#a07817]" />
            <span>Fabric Draping Masterclass</span>
          </button>

          <button
    onClick={() => setActiveTab("accessories")}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${activeTab === "accessories" ? "bg-white text-[#6b1426] shadow-xs border border-stone-200" : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/60"}`}
  >
            <Sparkles className="w-4 h-4 text-[#a07817]" />
            <span>Occasion &amp; Jewelry Matcher</span>
          </button>

          <button
    onClick={() => setActiveTab("checklist")}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${activeTab === "checklist" ? "bg-white text-[#6b1426] shadow-xs border border-stone-200" : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/60"}`}
  >
            <CheckCircle2 className="w-4 h-4 text-[#a07817]" />
            <span>Live Drape Checklist ({completedCount}/{currentDrape.steps.length})</span>
          </button>
        </div>

        {
    /* Tab 1: Fabric Draping Masterclass */
  }
        {activeTab === "drape" && <div className="p-6 lg:p-8 space-y-8">
            {
    /* Fabric DNA Banner */
  }
            <div className="p-5 bg-[#fbf8f2] rounded-xl border border-[#ebd9c3] grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#a07817]">
                  Fabric Nature
                </span>
                <p className="font-serif text-lg font-bold text-[#4a0e1b]">
                  {product.fabric}
                </p>
                <p className="text-xs text-stone-600">{fabricWeightLabel}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#a07817]">
                  Recommended Underskirt
                </span>
                <p className="text-xs font-medium text-stone-900 leading-relaxed">
                  {petticoatAdvice}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#a07817]">
                  Pleat Dynamics
                </span>
                <p className="text-xs font-medium text-stone-900 leading-relaxed">
                  {pleatingHold}
                </p>
              </div>
            </div>

            {
    /* Draping Style Selector Pills */
  }
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#881930]" />
                  <span>Choose Draping Style</span>
                </label>
                <span className="text-xs text-stone-500">
                  Ideal pleat width: <strong className="text-[#6b1426]">{currentDrape.pleatWidth}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {Object.keys(drapeStyles).map((key) => {
    const style = drapeStyles[key];
    const isSelected = selectedDrape === key;
    return <button
      key={key}
      onClick={() => {
        setSelectedDrape(key);
        setCompletedSteps({});
      }}
      className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${isSelected ? "border-[#881930] bg-[#fbf5f5] ring-1 ring-[#881930]" : "border-stone-200 hover:border-stone-300 bg-white"}`}
    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span
      className={`text-xs font-bold ${isSelected ? "text-[#6b1426]" : "text-stone-800"}`}
    >
                            {style.name}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#6b1426]" />}
                        </div>
                        <p className="text-[11px] text-stone-500 line-clamp-2 leading-tight">
                          {style.idealFor}
                        </p>
                      </div>
                      <span className="inline-block mt-2 text-[10px] font-semibold text-[#a07817] bg-[#fdf9ee] px-2 py-0.5 rounded w-max">
                        {style.difficulty}
                      </span>
                    </button>;
  })}
              </div>
            </div>

            {
    /* Active Style Overview Header */
  }
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-200/80 gap-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  {currentDrape.name}
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">{currentDrape.tagline}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0 text-xs">
                <span className="text-stone-500">
                  Best For: <strong className="text-stone-800">{currentDrape.idealFor}</strong>
                </span>
              </div>
            </div>

            {
    /* Step-by-Step Draping Guide */
  }
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#881930]" />
                <span>5-Step Master Drape Sequence</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {currentDrape.steps.map((st, idx) => {
    const isDone = !!completedSteps[idx];
    return <div
      key={idx}
      onClick={() => toggleStep(idx)}
      className={`relative p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${isDone ? "bg-emerald-50/60 border-emerald-300 shadow-2xs" : "bg-white border-stone-200 hover:border-stone-300"}`}
    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span
      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${isDone ? "bg-emerald-600 text-white" : "bg-[#6b1426] text-white"}`}
    >
                            {isDone ? "\u2713" : idx + 1}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {isDone ? "Done" : `Step ${idx + 1}`}
                          </span>
                        </div>

                        <h5 className="font-serif text-sm font-bold text-stone-900 mb-1.5 leading-snug">
                          {st.title.split(": ")[1] || st.title}
                        </h5>
                        <p className="text-xs text-stone-600 leading-relaxed">
                          {st.description}
                        </p>
                      </div>

                      {st.proTip && <div className="mt-3 pt-2 border-t border-stone-100 text-[11px] text-[#881930] flex items-start gap-1">
                          <Lightbulb className="w-3.5 h-3.5 text-[#a07817] shrink-0 mt-0.5" />
                          <span className="leading-tight">{st.proTip}</span>
                        </div>}
                    </div>;
  })}
              </div>
            </div>

            {
    /* Master Draper Secret Callout */
  }
            <div className="p-4 bg-gradient-to-r from-[#fbf4e8] to-[#fbf7f0] rounded-xl border border-[#ebd9c3] flex items-start gap-3.5">
              <div className="p-2 bg-white rounded-lg shadow-2xs shrink-0 text-[#a07817]">
                <Crown className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#6b1426] uppercase tracking-wider">
                  Master Weaver &amp; Draper’s Secret
                </span>
                <p className="text-xs text-stone-800 leading-relaxed">
                  {currentDrape.expertSecret}
                </p>
              </div>
            </div>
          </div>}

        {
    /* Tab 2: Occasion & Jewelry Matcher */
  }
        {activeTab === "accessories" && <div className="p-6 lg:p-8 space-y-8">
            {
    /* Occasion Selection Buttons */
  }
            <div>
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block mb-3">
                Select Your Upcoming Occasion
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(occasionPairings).map((key) => {
    const occ = occasionPairings[key];
    const isSelected = selectedOccasion === key;
    return <button
      key={key}
      onClick={() => setSelectedOccasion(key)}
      className={`px-4 py-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-2 ${isSelected ? "bg-[#6b1426] text-white border-[#6b1426] shadow-sm" : "bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-stone-50"}`}
    >
                      <span>{occ.label}</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#f5eedf]" />}
                    </button>;
  })}
              </div>
            </div>

            {
    /* Occasion Banner */
  }
            <div className="p-4 bg-[#fcf9f2] rounded-xl border border-[#ebd9c3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#a07817]">
                  {currentOccasion.badge}
                </span>
                <h3 className="font-serif text-lg font-bold text-[#4a0e1b]">
                  {currentOccasion.label} Styling Formula
                </h3>
                <p className="text-xs text-stone-600">{currentOccasion.vibe}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500">Harmonized for:</span>
                <span className="px-2.5 py-1 bg-white border border-stone-200 rounded text-xs font-semibold text-stone-900">
                  {product.color}
                </span>
              </div>
            </div>

            {
    /* 4 Feature Cards Grid */
  }
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {
    /* Card 1: Jewelry Ensemble */
  }
              <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-4 hover:shadow-xs transition-shadow">
                <div className="flex items-center gap-2.5 pb-2 border-b border-stone-100">
                  <div className="p-2 bg-amber-50 text-[#a07817] rounded-lg">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-stone-900">
                      Heirloom Jewelry Ensemble
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Metal harmonies matching the saree zari
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-semibold text-stone-800">Neckpiece:</span>
                    <p className="text-stone-600 mt-0.5">{currentOccasion.jewelry.neckwear}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-800">Earrings:</span>
                    <p className="text-stone-600 mt-0.5">{currentOccasion.jewelry.earrings}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-800">Bangles &amp; Wrists:</span>
                    <p className="text-stone-600 mt-0.5">{currentOccasion.jewelry.bangles}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-800">Waist &amp; Head Accents:</span>
                    <p className="text-stone-600 mt-0.5">{currentOccasion.jewelry.waistHead}</p>
                  </div>
                </div>
              </div>

              {
    /* Card 2: Blouse Cut & Contrast */
  }
              <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-4 hover:shadow-xs transition-shadow">
                <div className="flex items-center gap-2.5 pb-2 border-b border-stone-100">
                  <div className="p-2 bg-rose-50 text-[#881930] rounded-lg">
                    <Scissors className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-stone-900">
                      Bespoke Blouse Tailoring
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Cut, sleeves &amp; contrast shade guidance
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-semibold text-stone-800">Neckline Recommendation:</span>
                    <p className="text-stone-600 mt-0.5">{currentOccasion.blouse.neckline}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-800">Sleeve Silhouette:</span>
                    <p className="text-stone-600 mt-0.5">{currentOccasion.blouse.sleeves}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-[#881930]">Recommended Contrast Hue:</span>
                    <p className="text-stone-700 font-medium mt-0.5">
                      {currentOccasion.blouse.contrastRecommendation}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-800">Fabric &amp; Lining:</span>
                    <p className="text-stone-600 mt-0.5">{currentOccasion.blouse.fabricNote}</p>
                  </div>
                </div>
              </div>

              {
    /* Card 3: Footwear, Potli & Fragrance */
  }
              <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-4 hover:shadow-xs transition-shadow">
                <div className="flex items-center gap-2.5 pb-2 border-b border-stone-100">
                  <div className="p-2 bg-stone-100 text-stone-800 rounded-lg">
                    <Sparkles className="w-4 h-4 text-[#881930]" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-stone-900">
                      Footwear &amp; Regal Accoutrements
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Companions for balance, posture &amp; scent
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-semibold text-stone-800">Recommended Footwear:</span>
                    <p className="text-stone-600 mt-0.5">{currentOccasion.accessories.footwear}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-800">Potli / Minaudière:</span>
                    <p className="text-stone-600 mt-0.5">{currentOccasion.accessories.handbag}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-800">Heritage Scent / Attar:</span>
                    <p className="text-stone-600 mt-0.5">{currentOccasion.accessories.fragrance}</p>
                  </div>
                </div>
              </div>

              {
    /* Card 4: Hair, Beauty & Bindi */
  }
              <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-4 hover:shadow-xs transition-shadow">
                <div className="flex items-center gap-2.5 pb-2 border-b border-stone-100">
                  <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg">
                    <Palette className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-stone-900">
                      Hair, Beauty &amp; Bindi Aesthetic
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Royal Indian bridal and festive makeup notes
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-semibold text-stone-800">Hairstyle &amp; Flowers:</span>
                    <p className="text-stone-600 mt-0.5">{currentOccasion.beauty.hair}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-800">Makeup Palette:</span>
                    <p className="text-stone-600 mt-0.5">{currentOccasion.beauty.makeup}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-800">Bindi Styling:</span>
                    <p className="text-stone-600 mt-0.5">{currentOccasion.beauty.bindi}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>}

        {
    /* Tab 3: Live Drape Checklist */
  }
        {activeTab === "checklist" && <div className="p-6 lg:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-stone-50 rounded-xl border border-stone-200">
              <div>
                <h3 className="font-serif text-base font-bold text-stone-900">
                  Live Dressing Assistant: {currentDrape.name}
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  Check off each step as you drape your saree in front of the mirror.
                </p>
              </div>

              {
    /* Progress Bar */
  }
              <div className="w-full sm:w-48 space-y-1.5">
                <div className="flex justify-between text-xs font-mono font-semibold">
                  <span className="text-stone-600">Drape Progress</span>
                  <span className="text-[#6b1426]">{progressPercent}%</span>
                </div>
                <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
                  <div
    className="h-full bg-[#6b1426] transition-all duration-300"
    style={{ width: `${progressPercent}%` }}
  />
                </div>
              </div>
            </div>

            {
    /* Checklist items */
  }
            <div className="space-y-3">
              {currentDrape.steps.map((st, idx) => {
    const isChecked = !!completedSteps[idx];
    return <label
      key={idx}
      className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${isChecked ? "bg-emerald-50/50 border-emerald-300" : "bg-white border-stone-200 hover:border-stone-300"}`}
    >
                    <input
      type="checkbox"
      checked={isChecked}
      onChange={() => toggleStep(idx)}
      className="mt-1 w-4 h-4 text-[#6b1426] rounded border-stone-300 focus:ring-[#881930] cursor-pointer"
    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-stone-400">
                          0{idx + 1}
                        </span>
                        <h4
      className={`text-sm font-semibold ${isChecked ? "line-through text-stone-500" : "text-stone-900"}`}
    >
                          {st.title}
                        </h4>
                      </div>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                        {st.description}
                      </p>
                      {st.proTip && <p className="text-[11px] text-[#881930] mt-1.5 font-medium">
                          Tip: {st.proTip}
                        </p>}
                    </div>
                  </label>;
  })}
            </div>

            {
    /* Reset Button */
  }
            <div className="flex justify-end pt-2">
              <Button
    variant="ghost"
    size="sm"
    onClick={() => setCompletedSteps({})}
    className="text-xs text-stone-500 hover:text-stone-800"
  >
                Reset Checklist
              </Button>
            </div>
          </div>}

        {
    /* Footer: Silk Pinning Safety Advisory */
  }
        <div className="p-4 bg-stone-100/70 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-600 gap-3">
          <div className="flex items-center gap-2 text-stone-700">
            <ShieldAlert className="w-4 h-4 text-[#a07817] shrink-0" />
            <span>
              <strong>Silk &amp; Zari Safety Advisory:</strong> Always insert safety pins with a pearl bead or tiny button on the head to prevent pure zari threads from tearing or lodging inside the pin spring.
            </span>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="text-stone-400">|</span>
            <span className="font-serif italic text-stone-800">Saree Sansar Haute Couture</span>
          </div>
        </div>
      </div>

      {
    /* Modal: View Printable Style Card */
  }
      {showPrintModal && <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200">
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="text-xs font-bold text-[#881930] uppercase tracking-widest">
                  Official Style Blueprint
                </span>
                <h3 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                  {product.name}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Fabric: {product.fabric} · Palette: {product.color} · Occasion: {currentOccasion.label}
                </p>
              </div>

              <button
    onClick={() => setShowPrintModal(false)}
    className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-100 text-sm font-mono cursor-pointer"
  >
                ✕
              </button>
            </div>

            {
    /* Printable summary */
  }
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-stone-50 rounded-lg space-y-2">
                <h4 className="font-serif font-bold text-sm text-[#4a0e1b]">
                  Drape Selection: {currentDrape.name}
                </h4>
                <p className="text-stone-600">{currentDrape.tagline}</p>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-200 text-[11px]">
                  <div>
                    <span className="font-semibold text-stone-700">Pleat Width:</span>{" "}
                    <span>{currentDrape.pleatWidth}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-700">Recommended Inskirt:</span>{" "}
                    <span>{petticoatAdvice}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border border-stone-200 rounded-lg space-y-1.5">
                  <h5 className="font-bold text-stone-900">Jewelry Pairings</h5>
                  <p className="text-stone-600">• {currentOccasion.jewelry.neckwear}</p>
                  <p className="text-stone-600">• {currentOccasion.jewelry.earrings}</p>
                  <p className="text-stone-600">• {currentOccasion.jewelry.bangles}</p>
                </div>

                <div className="p-4 border border-stone-200 rounded-lg space-y-1.5">
                  <h5 className="font-bold text-stone-900">Blouse &amp; Contrast</h5>
                  <p className="text-stone-600">• Cut: {currentOccasion.blouse.neckline}</p>
                  <p className="text-stone-600">• Sleeves: {currentOccasion.blouse.sleeves}</p>
                  <p className="text-[#881930] font-medium">• Contrast: {currentOccasion.blouse.contrastRecommendation}</p>
                </div>
              </div>

              <div className="p-4 bg-[#fbf8f2] border border-[#ebd9c3] rounded-lg">
                <h5 className="font-bold text-[#4a0e1b] mb-1">Draper’s Golden Rule</h5>
                <p className="text-stone-700 italic">"{currentDrape.expertSecret}"</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
              <Button
    variant="outline"
    size="sm"
    onClick={() => window.print()}
    className="text-xs"
  >
                <Printer className="w-3.5 h-3.5 mr-1.5" />
                <span>Print Card</span>
              </Button>
              <Button
    variant="primary"
    size="sm"
    onClick={handleCopyFormula}
    className="text-xs"
  >
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                <span>Copy Summary</span>
              </Button>
            </div>
          </div>
        </div>}
    </section>;
};
