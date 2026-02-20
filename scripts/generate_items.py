import json
import random

# Existing items
existing_items = [
  {
    "name": "MacBook Pro 16\"",
    "description": "Apple MacBook Pro with M3 Max chip, 36GB RAM, 1TB SSD",
    "category": "Electronics",
    "quantity": 15,
    "price": 3499.99
  },
  {
    "name": "Dell UltraSharp 27\" Monitor",
    "description": "4K UHD USB-C monitor with HDR400 and 99% sRGB coverage",
    "category": "Electronics",
    "quantity": 30,
    "price": 629.99
  },
  {
    "name": "Ergonomic Office Chair",
    "description": "Mesh back office chair with lumbar support and adjustable armrests",
    "category": "Furniture",
    "quantity": 50,
    "price": 349.00
  },
  {
    "name": "Standing Desk",
    "description": "Electric height-adjustable standing desk, 60x30 inches",
    "category": "Furniture",
    "quantity": 25,
    "price": 549.99
  },
  {
    "name": "Mechanical Keyboard",
    "description": "Wireless mechanical keyboard with Cherry MX Brown switches and RGB backlight",
    "category": "Accessories",
    "quantity": 100,
    "price": 149.99
  },
  {
    "name": "Wireless Mouse",
    "description": "Ergonomic wireless mouse with 4000 DPI sensor and USB-C charging",
    "category": "Accessories",
    "quantity": 200,
    "price": 79.99
  },
  {
    "name": "USB-C Hub",
    "description": "7-in-1 USB-C hub with HDMI, ethernet, SD card reader, and USB-A ports",
    "category": "Accessories",
    "quantity": 75,
    "price": 59.99
  },
  {
    "name": "Noise Cancelling Headphones",
    "description": "Over-ear wireless headphones with active noise cancellation and 30hr battery",
    "category": "Electronics",
    "quantity": 40,
    "price": 299.99
  },
  {
    "name": "Webcam HD 1080p",
    "description": "Full HD webcam with auto-focus, built-in microphone, and privacy shutter",
    "category": "Electronics",
    "quantity": 60,
    "price": 89.99
  },
  {
    "name": "Desk Lamp LED",
    "description": "Adjustable LED desk lamp with 5 brightness levels and USB charging port",
    "category": "Furniture",
    "quantity": 80,
    "price": 39.99
  },
  {
    "name": "Laptop Backpack",
    "description": "Water-resistant backpack fits up to 17\" laptops with anti-theft pocket",
    "category": "Accessories",
    "quantity": 120,
    "price": 69.99
  },
  {
    "name": "External SSD 1TB",
    "description": "Portable NVMe SSD with 1050MB/s read speed and USB-C connection",
    "category": "Electronics",
    "quantity": 45,
    "price": 109.99
  },
  {
    "name": "Whiteboard 48x36",
    "description": "Magnetic dry-erase whiteboard with aluminum frame and marker tray",
    "category": "Office Supplies",
    "quantity": 20,
    "price": 89.00
  },
  {
    "name": "Notebook Pack (5-pk)",
    "description": "Premium ruled notebooks, 100 pages each, A5 size, assorted colors",
    "category": "Office Supplies",
    "quantity": 300,
    "price": 24.99
  },
  {
    "name": "Cable Management Kit",
    "description": "Under-desk cable tray with velcro ties, clips, and adhesive cord holders",
    "category": "Accessories",
    "quantity": 150,
    "price": 29.99
  },
  {
    "name": "Monitor Arm",
    "description": "Single monitor arm mount, supports 17-34\" screens up to 20 lbs, VESA compatible",
    "category": "Furniture",
    "quantity": 35,
    "price": 119.99
  },
  {
    "name": "Wireless Charger Pad",
    "description": "15W fast wireless charging pad compatible with Qi-enabled devices",
    "category": "Accessories",
    "quantity": 90,
    "price": 24.99
  },
  {
    "name": "Portable Projector",
    "description": "Mini LED projector with 1080p resolution, HDMI, and built-in speaker",
    "category": "Electronics",
    "quantity": 10,
    "price": 449.99
  },
  {
    "name": "Printer Ink Cartridge Set",
    "description": "Compatible ink cartridge set (Black, Cyan, Magenta, Yellow) for office printers",
    "category": "Office Supplies",
    "quantity": 200,
    "price": 44.99
  },
  {
    "name": "Surge Protector Power Strip",
    "description": "12-outlet surge protector with 2 USB-A and 1 USB-C port, 6ft cord",
    "category": "Electronics",
    "quantity": 70,
    "price": 34.99
  }
]

# Product templates for generating items
product_templates = {
    "Electronics": [
        ("Laptop Computer", "Professional laptop with {}GB RAM and {}GB SSD storage", 800, 2500),
        ("Desktop Computer", "All-in-one desktop with {}\" display and wireless keyboard/mouse", 600, 1800),
        ("Tablet Device", "{}-inch tablet with {}GB storage and stylus support", 300, 1200),
        ("Smartphone", "5G smartphone with {}GB RAM and {}MP camera", 400, 1400),
        ("Monitor {}", "{}-inch {} monitor with {}Hz refresh rate", 200, 900),
        ("Graphics Card", "{} graphics card with {}GB GDDR memory", 400, 1600),
        ("CPU Processor", "{} core processor with {}GHz clock speed", 200, 800),
        ("Power Supply", "{}W {} power supply with {} efficiency rating", 60, 300),
        ("Motherboard", "{} motherboard with {} slots and {} ports", 100, 500),
        ("RAM Module", "{}GB {} RAM module, {}MHz speed", 40, 400),
        ("Hard Drive", "{}TB {} hard drive with {} cache", 50, 300),
        ("Router", "{} band Wi-Fi {} router with {} antennas", 60, 350),
        ("Switch", "{}-port {} gigabit switch with {} management", 80, 600),
        ("Access Point", "Wireless access point supporting {} devices", 100, 450),
        ("UPS Battery", "{}VA UPS battery backup with {} outlets", 120, 800),
        ("Printer", "{} printer with {} connectivity", 80, 600),
        ("Scanner", "{} scanner with {} DPI resolution", 100, 500),
        ("Microphone", "{} microphone with {} pattern", 50, 400),
        ("Speaker System", "{} speaker system with {} subwoofer", 40, 350),
        ("Webcam {}", "{} webcam with {} resolution", 30, 200),
    ],
    "Furniture": [
        ("Office Chair {}", "{} office chair with {} adjustment", 150, 800),
        ("Desk {}", "{} desk with {} drawers", 200, 1200),
        ("Conference Table", "{} conference table seating {}", 400, 2500),
        ("Filing Cabinet", "{} drawer filing cabinet with {} lock", 80, 350),
        ("Bookshelf", "{} bookshelf with {} shelves", 60, 400),
        ("Storage Cabinet", "{} storage cabinet with {} doors", 100, 600),
        ("Reception Desk", "{} reception desk with {} countertop", 300, 1500),
        ("Break Room Table", "{} break room table for {}", 150, 700),
        ("Lounge Chair", "{} lounge chair with {} upholstery", 200, 900),
        ("Sofa Couch", "{} sofa with {} seating", 300, 1500),
        ("Coffee Table", "{} coffee table with {} finish", 80, 400),
        ("Side Table", "{} side table with {} storage", 40, 200),
        ("Wardrobe Cabinet", "{} wardrobe with {} hanging space", 150, 700),
        ("Locker Unit", "{} locker unit with {} compartments", 120, 600),
        ("Room Divider", "{} room divider with {} panels", 50, 300),
        ("Whiteboard Stand", "{} whiteboard stand with {} wheels", 80, 350),
        ("Presentation Board", "{} presentation board with {} surface", 60, 300),
        ("Coat Rack", "{} coat rack with {} hooks", 30, 150),
        ("Umbrella Stand", "{} umbrella stand with {} capacity", 20, 80),
        ("Waste Bin", "{} waste bin with {} lid", 15, 100),
    ],
    "Accessories": [
        ("Laptop Stand", "{} laptop stand with {} adjustment", 25, 120),
        ("Monitor Stand", "{} monitor stand with {} storage", 20, 100),
        ("Phone Stand", "{} phone stand with {} angle", 10, 50),
        ("Tablet Stand", "{} tablet stand with {} rotation", 15, 80),
        ("Cable Organizer", "{} cable organizer for {} cables", 8, 40),
        ("Desk Pad", "{} desk pad with {} surface", 15, 60),
        ("Mouse Pad", "{} mouse pad with {} material", 5, 35),
        ("Wrist Rest", "{} wrist rest with {} support", 10, 40),
        ("Foot Rest", "{} foot rest with {} adjustment", 20, 80),
        ("Document Holder", "{} document holder with {} angle", 15, 60),
        ("Drawer Organizer", "{} drawer organizer with {} compartments", 10, 45),
        ("Pen Holder", "{} pen holder with {} slots", 5, 25),
        ("Business Card Holder", "{} business card holder with {} capacity", 8, 30),
        ("Desk Clock", "{} desk clock with {} display", 12, 50),
        ("Memo Pad Holder", "{} memo pad holder with {} design", 6, 25),
        ("Stapler", "{} stapler with {} capacity", 8, 35),
        ("Tape Dispenser", "{} tape dispenser with {} base", 5, 25),
        ("Paper Cutter", "{} paper cutter with {} blade", 15, 80),
        ("Hole Punch", "{} hole punch for {} sheets", 8, 35),
        ("Binder Clip Set", "{} binder clips in {} sizes", 4, 20),
    ],
    "Office Supplies": [
        ("Copy Paper (Ream)", "{} copy paper, {} weight, {} sheets", 5, 15),
        ("Envelopes (Box)", "{} envelopes, {} size, {} count", 8, 25),
        ("Sticky Notes", "{} sticky notes, {} colors, {} pads", 3, 15),
        ("Highlighters (Set)", "{} highlighters in {} colors", 4, 18),
        ("Ballpoint Pens (Dozen)", "{} ballpoint pens with {} ink", 5, 20),
        ("Gel Pens (Set)", "{} gel pens in {} colors", 6, 25),
        ("Permanent Markers (Set)", "{} permanent markers, {} tip", 7, 22),
        ("Whiteboard Markers (Set)", "{} whiteboard markers in {} colors", 6, 20),
        ("Correction Tape", "{} correction tape with {} length", 3, 12),
        ("Glue Stick", "{} glue stick with {} adhesion", 2, 8),
        ("Scissors", "{} scissors with {} blade", 4, 18),
        ("Ruler", "{} ruler with {} marking", 2, 10),
        ("Calculator", "{} calculator with {} display", 10, 60),
        ("Staples (Box)", "{} staples for {} stapler", 3, 12),
        ("Paper Clips (Box)", "{} paper clips, {} size, {} count", 2, 8),
        ("Rubber Bands (Bag)", "{} rubber bands in {} sizes", 3, 10),
        ("Push Pins (Box)", "{} push pins in {} colors", 3, 10),
        ("Binder Rings (Set)", "{} binder rings, {} size", 4, 15),
        ("Index Cards (Pack)", "{} index cards, {} size, {} count", 3, 12),
        ("Labels (Roll)", "{} labels, {} size, {} per roll", 5, 20),
    ],
    "Software": [
        ("Antivirus License", "{} antivirus software license for {} users", 30, 150),
        ("Office Suite", "{} office suite license for {} devices", 100, 400),
        ("Project Management", "{} project management tool subscription, {} users", 50, 300),
        ("Design Software", "{} design software license, {} months", 200, 800),
        ("Video Editing", "{} video editing software license", 150, 600),
        ("Accounting Software", "{} accounting software for {} users", 100, 500),
        ("Cloud Storage", "{} cloud storage subscription, {}TB", 50, 300),
        ("VPN Service", "{} VPN service subscription, {} devices", 40, 200),
        ("Backup Software", "{} backup software license, {}TB", 60, 300),
        ("Communication Tool", "{} communication platform license, {} users", 30, 200),
        ("CRM Software", "{} CRM software subscription, {} users", 80, 500),
        ("HR Management", "{} HR management system, {} employees", 100, 600),
        ("Security Suite", "{} security suite license, {} endpoints", 120, 700),
        ("Development IDE", "{} IDE license for {} developers", 100, 500),
        ("Database Software", "{} database software license", 200, 1000),
        ("Virtualization", "{} virtualization software license", 300, 1500),
        ("Monitoring Tool", "{} monitoring software subscription", 150, 800),
        ("E-signature", "{} e-signature service, {} documents", 20, 150),
        ("Webinar Platform", "{} webinar platform subscription", 50, 300),
        ("Survey Tool", "{} survey tool subscription, {} responses", 30, 200),
    ],
    "Networking": [
        ("Ethernet Cable", "Cat{} ethernet cable, {}ft length", 5, 50),
        ("Fiber Cable", "{} fiber optic cable, {} meters", 20, 200),
        ("Patch Panel", "{} patch panel with {} ports", 50, 250),
        ("Server Rack", "{}U server rack with {} shelves", 200, 1500),
        ("Patch Cable (Pack)", "{} patch cables, {}ft, {} pack", 15, 80),
        ("Keystone Jack", "{} keystone jack, {} category", 3, 20),
        ("Cable Tester", "{} cable tester for {} cables", 30, 200),
        ("Crimping Tool", "{} crimping tool for {} connectors", 15, 80),
        ("Punch Down Tool", "{} punch down tool with {} blade", 20, 100),
        ("Cable Stripper", "{} cable stripper for {} cables", 10, 50),
        ("Network Tester", "{} network tester with {} features", 100, 600),
        ("Tone Generator", "{} tone generator and probe kit", 40, 200),
        ("Cable Ties (Bag)", "{} cable ties, {} length, {} count", 5, 25),
        ("Cable Labels (Roll)", "{} cable labels, {} per roll", 8, 35),
        ("Rack Mount Kit", "{} rack mount kit for {} equipment", 30, 150),
        ("Blanking Panel", "{}U blanking panel for server rack", 10, 50),
        ("Cable Manager", "{} cable manager for {} rack", 15, 80),
        ("PDU Power Strip", "{} PDU with {} outlets", 60, 350),
        ("KVM Switch", "{} port KVM switch for {} monitors", 80, 500),
        ("Console Server", "{} console server with {} ports", 200, 1200),
    ],
    "Storage": [
        ("NAS Device", "{} bay NAS with {}TB capacity", 300, 1500),
        ("SAN Storage", "{} SAN storage array with {}TB", 2000, 10000),
        ("Tape Drive", "{} tape drive with {}TB capacity", 500, 3000),
        ("Backup Tape", "{} backup tape cartridge, {}TB", 30, 150),
        ("DVD-R Spindle", "{} DVD-R discs, {} pack", 15, 50),
        ("Blu-Ray Discs", "{} Blu-Ray discs, {} pack", 20, 80),
        ("USB Flash Drive", "{}GB USB {} flash drive", 8, 80),
        ("Memory Card", "{}GB {} memory card", 10, 100),
        ("Hard Drive Enclosure", "{} hard drive enclosure for {} drives", 20, 100),
        ("Drive Dock", "{} drive dock with {} bays", 40, 200),
        ("Disk Array", "{} disk array controller", 300, 2000),
        ("Storage Shelf", "{} storage shelf for {} drives", 50, 300),
        ("Media Safe", "{} media safe with {} capacity", 100, 600),
        ("Fireproof Box", "{} fireproof document box", 40, 250),
        ("File Box (Pack)", "{} file boxes, {} pack", 20, 100),
        ("Plastic Bin", "{} plastic storage bin with {} lid", 10, 50),
        ("Archive Box", "{} archive boxes, {} pack", 15, 80),
        ("CD Wallet", "{} CD wallet holding {} discs", 8, 35),
        ("Media Cabinet", "{} media cabinet with {} drawers", 60, 400),
        ("Safe Deposit Box", "{} safe deposit box with {} key", 80, 500),
    ],
    "Audio": [
        ("Conference Phone", "{} conference phone with {} mics", 200, 800),
        ("Desk Phone", "{} desk phone with {} lines", 60, 300),
        ("Headset", "{} headset with {} microphone", 30, 200),
        ("Earbuds", "{} wireless earbuds with {} case", 40, 250),
        ("Bluetooth Speaker", "{} Bluetooth speaker with {} watts", 30, 200),
        ("Soundbar", "{} soundbar with {} subwoofer", 80, 500),
        ("PA System", "{} PA system with {} speakers", 200, 1000),
        ("Microphone Boom", "{} microphone boom arm with {} mount", 40, 200),
        ("Audio Mixer", "{} channel audio mixer", 150, 800),
        ("Audio Interface", "{} audio interface with {} inputs", 100, 600),
        ("Studio Monitors (Pair)", "{} studio monitors, {} inch", 150, 700),
        ("Subwoofer", "{} subwoofer with {} watts", 100, 500),
        ("Audio Cable", "{} audio cable, {}ft length", 8, 40),
        ("XLR Cable", "{} XLR cable, {}ft length", 12, 60),
        ("Speaker Stand", "{} speaker stand with {} base", 25, 120),
        ("Pop Filter", "{} pop filter for {} microphone", 10, 40),
        ("Shock Mount", "{} shock mount for {} mic", 30, 150),
        ("Acoustic Panels (Set)", "{} acoustic panels, {} pack", 40, 250),
        ("Headphone Amp", "{} headphone amplifier, {} channels", 50, 300),
        ("Audio Recorder", "{} audio recorder with {} storage", 100, 500),
    ],
    "Video": [
        ("Video Conference Camera", "{} video conference camera with {} zoom", 300, 1500),
        ("Document Camera", "{} document camera with {} resolution", 150, 800),
        ("Digital Signage", "{} digital signage display, {} inch", 400, 2500),
        ("Video Switcher", "{} input video switcher", 200, 1200),
        ("Video Extender", "{} video extender over {} cable", 80, 400),
        ("HDMI Splitter", "{} way HDMI splitter", 30, 200),
        ("HDMI Switch", "{} input HDMI switch", 25, 150),
        ("Capture Card", "{} capture card with {} input", 100, 600),
        ("Video Encoder", "{} video encoder for {} streams", 300, 1500),
        ("Streaming Device", "{} streaming device with {} resolution", 80, 400),
        ("Teleprompter", "{} teleprompter for {} camera", 150, 800),
        ("Green Screen", "{} green screen with {} stand", 40, 250),
        ("Light Kit", "{} light kit with {} lights", 80, 500),
        ("Ring Light", "{} ring light with {} tripod", 30, 200),
        ("Tripod", "{} tripod with {} head", 40, 250),
        ("Gimbal Stabilizer", "{} gimbal for {} camera", 150, 800),
        ("Video Monitor", "{} video monitor, {} inch", 200, 1000),
        ("Media Player", "{} media player with {} storage", 60, 400),
        ("KVM Extender", "{} KVM extender over {} cable", 150, 900),
        ("Video Wall Controller", "{} video wall controller for {} screens", 500, 3000),
    ],
    "Security": [
        ("IP Camera", "{} IP camera with {} resolution", 80, 500),
        ("NVR System", "{} channel NVR with {}TB", 300, 1500),
        ("Access Card", "{} access cards, {} pack", 50, 300),
        ("Card Reader", "{} card reader with {} interface", 100, 600),
        ("Door Lock", "{} electronic door lock with {} access", 150, 800),
        ("Intercom System", "{} intercom system with {} stations", 200, 1200),
        ("Alarm System", "{} alarm system with {} sensors", 150, 1000),
        ("Motion Sensor", "{} motion sensor with {} range", 30, 200),
        ("Smoke Detector", "{} smoke detector with {} sensor", 20, 150),
        ("CO Detector", "{} carbon monoxide detector", 25, 180),
        ("Security Keypad", "{} security keypad with {} zones", 60, 400),
        ("Panic Button", "{} panic button with {} alert", 40, 250),
        ("Key Safe", "{} key safe with {} capacity", 30, 200),
        ("Security Gate", "{} security gate with {} width", 500, 3000),
        ("Turnstile", "{} turnstile with {} direction", 800, 5000),
        ("Badge Holder", "{} badge holders, {} pack", 10, 60),
        ("Lanyard", "{} lanyards, {} pack", 8, 50),
        ("Visitor Badge", "{} visitor badges, {} pack", 15, 80),
        ("Security Sign", "{} security sign with {} message", 12, 60),
        ("Cable Lock", "{} cable lock for {} devices", 15, 80),
    ],
    "Cleaning": [
        ("Disinfectant Wipes", "{} disinfectant wipes, {} count", 5, 25),
        ("Hand Sanitizer", "{} hand sanitizer, {} oz", 4, 20),
        ("Paper Towels (Case)", "{} paper towels, {} rolls", 20, 80),
        ("Toilet Paper (Case)", "{} toilet paper, {} rolls", 15, 60),
        ("Trash Bags (Box)", "{} trash bags, {} count", 8, 40),
        ("All-Purpose Cleaner", "{} all-purpose cleaner, {} gallon", 10, 50),
        ("Glass Cleaner", "{} glass cleaner, {} oz", 5, 25),
        ("Floor Cleaner", "{} floor cleaner, {} gallon", 12, 60),
        ("Carpet Cleaner", "{} carpet cleaner, {} oz", 8, 40),
        ("Air Freshener", "{} air freshener, {} pack", 6, 30),
        ("Mop Bucket", "{} mop bucket with {} wringer", 25, 120),
        ("Wet Floor Sign", "{} wet floor sign, {} pack", 10, 50),
        ("Microfiber Cloths", "{} microfiber cloths, {} pack", 8, 40),
        ("Dust Mop", "{} dust mop with {} handle", 15, 80),
        ("Broom", "{} broom with {} bristles", 12, 60),
        ("Dustpan", "{} dustpan with {} handle", 8, 40),
        ("Vacuum Cleaner", "{} vacuum cleaner with {} filter", 80, 400),
        ("Steam Cleaner", "{} steam cleaner with {} attachments", 150, 800),
        ("Pressure Washer", "{} pressure washer, {} PSI", 200, 1000),
        ("Window Squeegee", "{} window squeegee with {} handle", 10, 50),
    ],
    "Kitchen": [
        ("Coffee Maker", "{} coffee maker with {} capacity", 50, 300),
        ("Water Cooler", "{} water cooler with {} temperatures", 100, 600),
        ("Microwave Oven", "{} microwave with {} watts", 60, 300),
        ("Mini Fridge", "{} mini fridge with {} capacity", 100, 500),
        ("Dishwasher", "{} dishwasher with {} place settings", 300, 1500),
        ("Paper Plates (Pack)", "{} paper plates, {} count", 8, 35),
        ("Plastic Cups (Pack)", "{} plastic cups, {} count", 6, 30),
        ("Plastic Cutlery (Pack)", "{} plastic cutlery, {} count", 5, 25),
        ("Napkins (Pack)", "{} napkins, {} count", 4, 20),
        ("Coffee (Box)", "{} coffee pods, {} count", 15, 80),
        ("Tea Box", "{} tea bags, {} assorted", 8, 40),
        ("Sugar Packets (Box)", "{} sugar packets, {} count", 5, 25),
        ("Creamer (Box)", "{} creamer portions, {} count", 6, 30),
        ("Water Bottles (Case)", "{} water bottles, {} case", 10, 50),
        ("Soda Cans (Case)", "{} soda cans, {} case", 12, 60),
        ("Snack Box", "{} assorted snacks, {} count", 20, 100),
        ("Utensil Tray", "{} utensil tray with {} compartments", 15, 80),
        ("Paper Towel Holder", "{} paper towel holder with {} mount", 12, 60),
        ("Trash Can", "{} trash can with {} lid", 20, 100),
        ("Recycling Bin", "{} recycling bin with {} compartments", 25, 120),
    ],
    "Stationery": [
        ("Business Cards (Box)", "{} business cards, {} count", 30, 150),
        ("Letterhead (Ream)", "{} letterhead paper, {} sheets", 15, 80),
        ("Envelope Seals", "{} envelope seals, {} count", 5, 25),
        ("Rubber Stamp", "{} rubber stamp with {} text", 10, 50),
        ("Ink Pad", "{} ink pad in {} color", 4, 20),
        ("Calligraphy Set", "{} calligraphy set with {} nibs", 20, 100),
        ("Fountain Pen", "{} fountain pen with {} nib", 30, 200),
        ("Pen Refills (Pack)", "{} pen refills, {} pack", 8, 40),
        ("Ink Cartridges", "{} ink cartridges, {} color", 15, 80),
        ("Toner Cartridge", "{} toner cartridge, {} pages", 40, 250),
        ("Label Maker", "{} label maker with {} tape", 30, 180),
        ("Label Tape", "{} label tape, {} meters", 10, 50),
        ("Laminator", "{} laminator with {} width", 50, 300),
        ("Lamination Pouches", "{} laminating pouches, {} pack", 15, 80),
        ("Binding Machine", "{} binding machine for {} sheets", 80, 500),
        ("Binding Combs", "{} binding combs, {} pack", 10, 60),
        ("Report Covers", "{} report covers, {} pack", 8, 40),
        ("Presentation Folders", "{} presentation folders, {} pack", 12, 70),
        ("Certificate Paper", "{} certificate paper, {} sheets", 10, 60),
        ("Desk Nameplate", "{} desk nameplate with {} holder", 8, 45),
    ],
    "Health & Safety": [
        ("First Aid Kit", "{} first aid kit with {} items", 25, 150),
        ("AED Defibrillator", "{} AED with {} pads", 800, 3000),
        ("Fire Extinguisher", "{} fire extinguisher, {} type", 40, 250),
        ("Emergency Light", "{} emergency light with {} battery", 30, 200),
        ("Exit Sign", "{} exit sign with {} illumination", 25, 180),
        ("Safety Glasses", "{} safety glasses, {} pack", 10, 60),
        ("Ear Plugs (Box)", "{} ear plugs, {} pairs", 15, 80),
        ("Dust Masks (Box)", "{} dust masks, {} count", 12, 60),
        ("Gloves (Box)", "{} gloves, {} pairs", 10, 50),
        ("Hard Hat", "{} hard hat with {} suspension", 15, 80),
        ("Safety Vest", "{} safety vest with {} reflectors", 10, 60),
        ("Fall Protection", "{} fall protection harness", 80, 500),
        ("Eye Wash Station", "{} eye wash station with {} solution", 60, 400),
        ("Safety Shower", "{} safety shower with {} curtain", 200, 1200),
        ("Spill Kit", "{} spill kit for {} materials", 50, 300),
        ("Biohazard Bags", "{} biohazard bags, {} pack", 12, 70),
        ("Sharps Container", "{} sharps container with {} capacity", 15, 90),
        ("Thermometer", "{} thermometer with {} accuracy", 20, 120),
        ("Blood Pressure Monitor", "{} BP monitor with {} cuff", 30, 200),
        ("Pulse Oximeter", "{} pulse oximeter with {} display", 25, 150),
    ],
}

# Adjectives for variation
adjectives = ["Professional", "Premium", "Standard", "Compact", "Portable", "Wireless", "Wired", 
              "Digital", "Analog", "Smart", "Industrial", "Commercial", "Home", "Office", 
              "Ergonomic", "Adjustable", "Folding", "Modular", "Heavy-Duty", "Lightweight",
              "Rechargeable", "Battery-Powered", "USB", "Bluetooth", "WiFi", "High-Speed",
              "Ultra", "Pro", "Elite", "Basic", "Advanced", "Multi-Function", "Universal",
              "Waterproof", "Dustproof", "Shockproof", "Fire-Resistant", "Anti-Static",
              "Eco-Friendly", "Recyclable", "Biodegradable", "Non-Toxic", "Hypoallergenic"]

# Specs for descriptions
specs = {
    "ram": [8, 16, 32, 64, 128],
    "storage": [256, 512, 1024, 2048],
    "screen_size": [13, 15, 17, 21, 24, 27, 32, 34, 43, 55, 65],
    "capacity": [1, 2, 4, 8, 16, 32, 64],
    "watts": [10, 20, 50, 100, 200, 500, 1000],
    "users": [1, 5, 10, 25, 50, 100, 250, 500],
    "ports": [4, 8, 16, 24, 48],
    "speed": [100, 300, 600, 1000, 2000, 3000],
    "length": [3, 6, 10, 15, 25, 50, 100],
    "count": [10, 25, 50, 100, 250, 500, 1000],
    "months": [12, 24, 36],
    "resolution": ["720p", "1080p", "2K", "4K", "8K"],
    "refresh_rate": [60, 75, 120, 144, 240],
    "color": ["Black", "White", "Silver", "Gray", "Blue", "Red", "Green"],
}

def generate_item(category, index):
    templates = product_templates[category]
    template = random.choice(templates)
    name_template, desc_template, min_price, max_price = template
    
    # Generate random specs
    adj = random.choice(adjectives)
    
    # Replace {} in name
    if "{}" in name_template:
        if "Monitor" in name_template or "Camera" in name_template or "Speaker" in name_template:
            name = name_template.format(random.choice(specs["screen_size"]))
        elif "Phone" in name_template:
            name = name_template.format(random.choice(["Desk", "Conference", "Wireless", "VoIP"]))
        elif "Chair" in name_template:
            name = name_template.format(random.choice(["Executive", "Mesh", "Leather", "Task"]))
        elif "Desk" in name_template:
            name = name_template.format(random.choice(["Standing", "Executive", "Corner", "Computer"]))
        else:
            name = name_template.format(adj)
    else:
        name = f"{adj} {name_template}"
    
    # Make name unique with index
    name = f"{name} - Model {index+1:04d}"
    
    # Generate description - count placeholders first
    placeholder_count = desc_template.count('{}')
    
    if placeholder_count == 0:
        desc = desc_template
    elif placeholder_count == 1:
        if "RAM" in desc_template or "memory" in desc_template.lower():
            desc = desc_template.format(random.choice(specs["ram"]))
        elif "storage" in desc_template or "TB" in desc_template or "GB" in desc_template:
            desc = desc_template.format(random.choice(specs["capacity"]))
        elif "watt" in desc_template.lower():
            desc = desc_template.format(random.choice(specs["watts"]))
        elif "user" in desc_template.lower() or "license" in desc_template.lower():
            desc = desc_template.format(random.choice(specs["users"]))
        elif "port" in desc_template.lower():
            desc = desc_template.format(random.choice(specs["ports"]))
        elif "ft" in desc_template or "meter" in desc_template.lower():
            desc = desc_template.format(random.choice(specs["length"]))
        elif "count" in desc_template.lower() or "pack" in desc_template.lower():
            desc = desc_template.format(random.choice(specs["count"]))
        elif "month" in desc_template.lower():
            desc = desc_template.format(random.choice(specs["months"]))
        elif "resolution" in desc_template.lower():
            desc = desc_template.format(random.choice(specs["resolution"]))
        else:
            desc = desc_template.format(adj)
    elif placeholder_count == 2:
        if "RAM" in desc_template or "memory" in desc_template.lower():
            desc = desc_template.format(random.choice(specs["ram"]), random.choice(specs["storage"]))
        elif "storage" in desc_template:
            desc = desc_template.format(random.choice(specs["capacity"]), random.choice(["SSD", "HDD", "NVMe"]))
        else:
            desc = desc_template.format(adj, random.choice(specs["color"]))
    elif placeholder_count == 3:
        if "display" in desc_template or "monitor" in desc_template.lower() or "screen" in desc_template:
            desc = desc_template.format(random.choice(specs["screen_size"]), random.choice(["IPS", "VA", "TN", "OLED"]), random.choice(specs["refresh_rate"]))
        else:
            desc = desc_template.format(adj, random.choice(specs["color"]), random.choice(["Standard", "Premium", "Professional"]))
    else:
        desc = desc_template
    
    # Generate price
    price = round(random.uniform(min_price, max_price), 2)
    
    # Generate quantity
    quantity = random.randint(5, 500)
    
    return {
        "name": name,
        "description": desc,
        "category": category,
        "quantity": quantity,
        "price": price
    }

# Generate 5000 new items
new_items = []
categories = list(product_templates.keys())

for i in range(5000):
    category = categories[i % len(categories)]
    item = generate_item(category, i)
    new_items.append(item)

# Combine with existing items
all_items = existing_items + new_items

# Write to file
with open('sample-data/items.json', 'w') as f:
    json.dump(all_items, f, indent=2)

print(f"Generated {len(new_items)} new items")
print(f"Total items: {len(all_items)}")
print(f"Categories covered: {len(categories)}")

# Show category distribution
category_counts = {}
for item in all_items:
    cat = item["category"]
    category_counts[cat] = category_counts.get(cat, 0) + 1

print("\nCategory distribution:")
for cat, count in sorted(category_counts.items()):
    print(f"  {cat}: {count}")
