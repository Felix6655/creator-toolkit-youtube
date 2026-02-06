// Template-based generators for Creator Toolkit YouTube
// No AI API keys required - uses deterministic template logic with variation

const titleTemplates = {
  curiosity: [
    "What Happens When You {action} {topic}?",
    "The Truth About {topic} Nobody Tells You",
    "Why {topic} Changed Everything I Knew About {niche}",
    "I Discovered Something Shocking About {topic}",
    "{topic}: The Secret {niche} Experts Don't Share"
  ],
  howTo: [
    "How to {action} {topic} (Step-by-Step Guide)",
    "The Ultimate Guide to {action} {topic}",
    "Master {topic} in {time} - Complete Tutorial",
    "How I {action} {topic} (And How You Can Too)",
    "{action} {topic} Like a Pro - Beginner to Expert"
  ],
  list: [
    "{number} {topic} Tips That Will Change Your {niche}",
    "Top {number} Mistakes When {action} {topic}",
    "{number} Things I Wish I Knew Before {action} {topic}",
    "{number} {topic} Hacks That Actually Work",
    "The {number} Best {topic} Strategies for {year}"
  ],
  challenge: [
    "I Tried {topic} for {time} - Here's What Happened",
    "{time} {topic} Challenge: My Honest Results",
    "Can You Really {action} {topic} in {time}?",
    "Testing {topic} for {time}: Worth It?",
    "I Spent {time} Mastering {topic} - The Results"
  ],
  comparison: [
    "{topic} vs {alternative}: Which is Better?",
    "Why I Switched from {alternative} to {topic}",
    "{topic} vs {alternative}: The Ultimate Comparison",
    "I Tested {topic} and {alternative} - Clear Winner",
    "The Real Difference Between {topic} and {alternative}"
  ]
}

const hookTemplates = [
  "Stop everything you're doing because {hook_reason}...",
  "In the next {time}, I'm going to show you exactly how to {promise}...",
  "If you've ever struggled with {pain_point}, this video is for you...",
  "Here's something that took me {time} to figure out about {topic}...",
  "Most people get this completely wrong about {topic}, and here's why...",
  "What if I told you that {contrarian_statement}?",
  "I'm about to share the exact {method} I used to {result}...",
  "By the end of this video, you'll know exactly how to {promise}...",
  "This single {thing} changed everything about how I approach {topic}...",
  "The biggest mistake I see with {topic} is {mistake}, and here's the fix..."
]

const synonyms = {
  action: ['master', 'learn', 'understand', 'improve', 'optimize', 'transform', 'level up', 'dominate', 'crush'],
  time: ['30 days', '7 days', '24 hours', 'one week', 'one month', '100 days'],
  number: ['5', '7', '10', '3', '12', '15', '8'],
  year: ['2025', '2024', 'this year']
}

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)]

const fillTemplate = (template, data) => {
  let result = template
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`{${key}}`, 'g')
    result = result.replace(regex, data[key])
  })
  // Fill remaining placeholders with synonyms
  Object.keys(synonyms).forEach(key => {
    const regex = new RegExp(`{${key}}`, 'g')
    result = result.replace(regex, pickRandom(synonyms[key]))
  })
  return result
}

export function generateTitleHook(input) {
  const { topic, niche, targetAudience, videoStyle } = input
  
  const data = {
    topic: topic || 'this topic',
    niche: niche || 'your field',
    alternative: niche || 'alternatives',
    hook_reason: `this will change how you think about ${topic}`,
    promise: `master ${topic} faster than you thought possible`,
    pain_point: topic,
    contrarian_statement: `everything you know about ${topic} is wrong`,
    method: 'strategy',
    result: `achieve amazing results with ${topic}`,
    thing: 'insight',
    mistake: 'not understanding the fundamentals'
  }
  
  const titles = []
  const categories = Object.keys(titleTemplates)
  
  // Generate 10 diverse titles
  for (let i = 0; i < 10; i++) {
    const category = categories[i % categories.length]
    const templates = titleTemplates[category]
    const template = templates[i % templates.length]
    titles.push({
      title: fillTemplate(template, data),
      style: category,
      tip: getCategoryTip(category)
    })
  }
  
  // Generate 5 hooks
  const hooks = []
  for (let i = 0; i < 5; i++) {
    hooks.push({
      hook: fillTemplate(hookTemplates[i], data),
      type: getHookType(i),
      bestFor: getHookBestFor(i)
    })
  }
  
  return { titles, hooks, generatedAt: new Date().toISOString() }
}

function getCategoryTip(category) {
  const tips = {
    curiosity: 'Great for driving clicks with intrigue',
    howTo: 'Perfect for tutorial content, ranks well in search',
    list: 'High CTR format, easy to consume',
    challenge: 'Builds anticipation and storytelling',
    comparison: 'Captures search intent for buyers'
  }
  return tips[category] || 'Versatile title format'
}

function getHookType(index) {
  const types = ['Pattern Interrupt', 'Promise', 'Empathy', 'Authority', 'Curiosity']
  return types[index] || 'General'
}

function getHookBestFor(index) {
  const uses = ['Grabbing attention fast', 'Educational content', 'Relatable content', 'Tutorial/guide videos', 'Controversial takes']
  return uses[index] || 'General content'
}

export function generateScriptOutline(input) {
  const { topic, videoLength, keyPoints, targetAudience, callToAction } = input
  
  const lengthMinutes = parseInt(videoLength) || 10
  const points = keyPoints ? keyPoints.split(',').map(p => p.trim()).filter(Boolean) : ['Main Point 1', 'Main Point 2', 'Main Point 3']
  
  // Calculate timestamps
  const introLength = Math.min(60, lengthMinutes * 6) // ~10% for intro
  const ctaLength = 30
  const mainContentLength = (lengthMinutes * 60) - introLength - ctaLength
  const sectionLength = Math.floor(mainContentLength / points.length)
  
  let currentTime = 0
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  const outline = {
    intro: {
      timestamp: formatTime(currentTime),
      duration: `${Math.floor(introLength / 60)} min`,
      elements: [
        { type: 'Hook', content: `Open with a compelling hook about ${topic}`, tips: 'First 3 seconds are crucial - make them count' },
        { type: 'Credibility', content: 'Briefly establish why you can speak on this topic', tips: 'Keep it short - 1-2 sentences max' },
        { type: 'Promise', content: `Tell viewers exactly what they\'ll learn about ${topic}`, tips: 'Be specific about the value they\'ll get' },
        { type: 'Preview', content: 'Quick overview of what\'s coming', tips: 'Creates anticipation and reduces drop-off' }
      ]
    },
    sections: [],
    cta: {
      timestamp: formatTime((lengthMinutes * 60) - ctaLength),
      duration: '30 sec',
      elements: [
        { type: 'Recap', content: 'Quick summary of key takeaways', tips: 'Reinforces value delivered' },
        { type: 'Action', content: callToAction || 'Subscribe for more content like this', tips: 'Be specific about what you want them to do' },
        { type: 'Next Video', content: 'Tease related content to watch next', tips: 'Increases watch time and session duration' }
      ]
    },
    metadata: {
      totalLength: `${lengthMinutes} minutes`,
      sectionCount: points.length,
      generatedAt: new Date().toISOString()
    }
  }
  
  currentTime = introLength
  points.forEach((point, index) => {
    outline.sections.push({
      number: index + 1,
      title: point,
      timestamp: formatTime(currentTime),
      duration: `${Math.floor(sectionLength / 60)} min`,
      elements: [
        { type: 'Transition', content: index === 0 ? 'Dive into the first point' : `Transition from ${points[index - 1]}`, tips: 'Smooth transitions keep viewers engaged' },
        { type: 'Main Content', content: `Deep dive into: ${point}`, tips: 'Use examples, stories, or demonstrations' },
        { type: 'Key Insight', content: `Share your unique perspective on ${point}`, tips: 'This is where you add unique value' },
        { type: 'Mini CTA', content: 'Engagement prompt (comment, like)', tips: 'Mid-roll engagement boosts algorithm favor' }
      ]
    })
    currentTime += sectionLength
  })
  
  // Generate chapters for YouTube
  outline.chapters = [
    { time: '0:00', title: 'Introduction' },
    ...outline.sections.map(s => ({ time: s.timestamp, title: s.title })),
    { time: outline.cta.timestamp, title: 'Wrap Up & Next Steps' }
  ]
  
  return outline
}

export function generateThumbnailBrief(input) {
  const { topic, emotion, targetAudience, competitorStyle } = input
  
  const textOptions = [
    { text: topic.toUpperCase(), style: 'Bold Impact', placement: 'Center or Right Third' },
    { text: `The ${topic} Secret`, style: 'Mystery/Intrigue', placement: 'Top Third' },
    { text: `${topic} 101`, style: 'Educational', placement: 'Bottom Third' },
    { text: `I Tried ${topic}`, style: 'Personal Story', placement: 'Center' },
    { text: `${topic}?!`, style: 'Curiosity/Shock', placement: 'Large, Center' }
  ]
  
  const visualConcepts = [
    {
      concept: 'Before/After Split',
      description: 'Show transformation or comparison visually',
      elements: ['Split screen effect', 'Contrasting colors', 'Clear visual difference'],
      bestFor: 'Tutorial, transformation, or comparison content'
    },
    {
      concept: 'Face + Emotion',
      description: 'Your face with strong emotion related to content',
      elements: ['High contrast lighting', 'Expressive face', 'Minimal background'],
      bestFor: 'Personal stories, reactions, vlogs'
    },
    {
      concept: 'Object Focus',
      description: `Clean shot of key ${topic}-related object or symbol`,
      elements: ['Shallow depth of field', 'Dramatic lighting', 'Bold text overlay'],
      bestFor: 'Product reviews, how-to content'
    },
    {
      concept: 'Text-Dominant',
      description: 'Large, readable text as the main element',
      elements: ['High contrast text', 'Simple background', 'Maybe small supporting image'],
      bestFor: 'Educational content, lists, news'
    }
  ]
  
  const colorMoods = [
    { mood: 'High Energy', colors: ['Red', 'Orange', 'Yellow'], effect: 'Excitement, urgency, attention' },
    { mood: 'Trust & Calm', colors: ['Blue', 'Green', 'White'], effect: 'Credibility, relaxation, clarity' },
    { mood: 'Premium', colors: ['Black', 'Gold', 'Deep Purple'], effect: 'Luxury, exclusivity, authority' },
    { mood: 'Fresh & Fun', colors: ['Teal', 'Pink', 'Bright Green'], effect: 'Youth, creativity, energy' }
  ]
  
  const compositionTips = [
    'Follow the rule of thirds - place key elements on intersection points',
    'Leave space for YouTube\'s timestamp overlay (bottom right corner)',
    'Ensure text is readable at small sizes (mobile viewing)',
    'Use 3 or fewer colors for maximum impact',
    'Face looking towards the text guides viewer\'s eye',
    'High contrast between text and background is essential'
  ]
  
  return {
    textOptions,
    visualConcepts,
    colorMoods,
    compositionTips,
    technicalSpecs: {
      dimensions: '1280 x 720 pixels',
      aspectRatio: '16:9',
      format: 'JPG or PNG',
      maxSize: '2MB',
      safeZone: 'Keep key elements away from edges (10% margin)'
    },
    generatedAt: new Date().toISOString()
  }
}

export function generateSeoToolkit(input) {
  const { topic, videoTitle, targetKeywords, videoLength } = input
  
  const keywords = targetKeywords ? targetKeywords.split(',').map(k => k.trim()) : [topic]
  const lengthMins = parseInt(videoLength) || 10
  
  // Generate description
  const description = {
    full: `In this video, I'm diving deep into ${topic}. Whether you're a beginner or looking to level up your skills, this comprehensive guide covers everything you need to know.

🔥 What you'll learn:
${keywords.map((k, i) => `• ${k}`).join('\n')}

⏰ Timestamps:
0:00 - Introduction
${Math.floor(lengthMins * 0.1)}:00 - Getting Started
${Math.floor(lengthMins * 0.3)}:00 - Deep Dive
${Math.floor(lengthMins * 0.6)}:00 - Advanced Tips
${Math.floor(lengthMins * 0.9)}:00 - Wrap Up

📌 Resources mentioned:
[Add your links here]

🔔 Don't forget to subscribe and hit the bell for more ${topic} content!

#${topic.replace(/\s+/g, '')} #${keywords[0]?.replace(/\s+/g, '') || 'YouTube'}`,
    tips: [
      'First 200 characters are most important - include main keyword',
      'Add timestamps (chapters) for better user experience and SEO',
      'Include relevant hashtags (3-5 max)',
      'Add links to resources, social media, related videos'
    ]
  }
  
  // Generate tags
  const baseTags = [topic, ...keywords]
  const expandedTags = [
    ...baseTags,
    `${topic} tutorial`,
    `${topic} for beginners`,
    `how to ${topic}`,
    `${topic} tips`,
    `${topic} guide`,
    `${topic} 2025`,
    `learn ${topic}`,
    `${topic} explained`,
    `best ${topic}`,
    `${topic} review`
  ].slice(0, 15)
  
  const tags = {
    list: expandedTags,
    tips: [
      'Use a mix of broad and specific tags',
      'Include your brand/channel name',
      'Add trending related terms',
      'Don\'t exceed 500 characters total'
    ]
  }
  
  // Generate chapters
  const chapters = [
    { time: '0:00', title: 'Introduction', tip: 'Must start at 0:00' },
    { time: `${Math.floor(lengthMins * 0.08)}:00`, title: `What is ${topic}?`, tip: 'Define the topic early' },
    { time: `${Math.floor(lengthMins * 0.2)}:00`, title: 'Getting Started', tip: 'Beginner-friendly section' },
    { time: `${Math.floor(lengthMins * 0.4)}:00`, title: 'Core Concepts', tip: 'Main content delivery' },
    { time: `${Math.floor(lengthMins * 0.6)}:00`, title: 'Pro Tips & Tricks', tip: 'Advanced value' },
    { time: `${Math.floor(lengthMins * 0.8)}:00`, title: 'Common Mistakes', tip: 'Helps with retention' },
    { time: `${Math.floor(lengthMins * 0.9)}:00`, title: 'Summary & Next Steps', tip: 'Strong close' }
  ]
  
  // Generate pinned comment
  const pinnedComment = {
    text: `Thanks for watching! 🙏 Quick question for you: What's your biggest challenge with ${topic}? Drop it in the comments and I'll try to help!

📌 Key takeaways from this video:
1. [First main point]
2. [Second main point]  
3. [Third main point]

👉 Want more ${topic} content? Let me know what you'd like to see next!`,
    tips: [
      'Pin a comment to boost engagement',
      'Ask a question to encourage responses',
      'Summarize key points for value',
      'Include a soft CTA'
    ]
  }
  
  return {
    description,
    tags,
    chapters,
    pinnedComment,
    titleOptimization: {
      current: videoTitle || `${topic} - Complete Guide`,
      tips: [
        'Keep under 60 characters for full visibility',
        'Front-load main keyword',
        'Include power words (Ultimate, Complete, Easy)',
        'Add year for evergreen content'
      ]
    },
    generatedAt: new Date().toISOString()
  }
}

export function generateUploadChecklist(input) {
  const { topic, scheduledDate, isPartOfSeries } = input
  
  const prePublish = [
    { task: 'Video exported in correct format', details: '1080p or 4K, H.264 codec recommended', critical: true, checked: false },
    { task: 'Audio levels checked', details: '-14 to -10 dB average, no clipping', critical: true, checked: false },
    { task: 'Captions/subtitles added', details: 'Auto-captions reviewed and corrected', critical: false, checked: false },
    { task: 'Thumbnail created and optimized', details: '1280x720, under 2MB, readable at small size', critical: true, checked: false },
    { task: 'Title finalized', details: 'Under 60 chars, keyword at front', critical: true, checked: false },
    { task: 'Description written', details: 'Keywords, timestamps, links included', critical: true, checked: false },
    { task: 'Tags added', details: '8-15 relevant tags, mix of broad and specific', critical: false, checked: false },
    { task: 'End screen elements added', details: 'Subscribe button, next video, playlist', critical: false, checked: false },
    { task: 'Cards added at key moments', details: 'Link to related content, playlists', critical: false, checked: false },
    { task: 'Category selected', details: 'Choose most relevant category', critical: false, checked: false },
    { task: 'Playlist assignment', details: 'Add to relevant playlist(s)', critical: false, checked: false }
  ]
  
  const publishDay = [
    { task: 'Double-check scheduled time', details: 'Optimal: Tue-Thu, 2-4 PM audience time', critical: true, checked: false },
    { task: 'Notify your community', details: 'Community post, Stories, other platforms', critical: false, checked: false },
    { task: 'Prepare pinned comment', details: 'Ready to post immediately after publish', critical: false, checked: false },
    { task: 'Social media posts ready', details: 'Twitter, Instagram, etc. with video link', critical: false, checked: false },
    { task: 'Email list notification', details: 'If applicable, draft email ready', critical: false, checked: false },
    { task: 'Respond to early comments', details: 'First hour engagement is crucial', critical: true, checked: false }
  ]
  
  const postPublish = [
    { task: 'Monitor first 24 hours', details: 'Check CTR, watch time, comments', critical: true, checked: false, timing: 'First 24 hours' },
    { task: 'Respond to all comments', details: 'Build community, boost engagement', critical: true, checked: false, timing: 'First 48 hours' },
    { task: 'Share to relevant communities', details: 'Reddit, Discord, Facebook groups (follow rules)', critical: false, checked: false, timing: 'First week' },
    { task: 'Analyze performance', details: 'Compare to previous videos, note learnings', critical: false, checked: false, timing: 'After 7 days' },
    { task: 'Update description if needed', details: 'Add corrections, new links', critical: false, checked: false, timing: 'Ongoing' },
    { task: 'Plan follow-up content', details: 'Based on comments and performance', critical: false, checked: false, timing: 'After 7 days' }
  ]
  
  const bestPractices = [
    'Upload 24+ hours before scheduled publish for processing',
    'Best days: Tuesday, Wednesday, Thursday',
    'Best times: 2-4 PM in your audience\'s timezone',
    'First 48 hours determine video\'s long-term performance',
    'Consistency matters more than perfect timing'
  ]
  
  return {
    prePublish,
    publishDay,
    postPublish,
    bestPractices,
    videoDetails: {
      topic,
      scheduledDate: scheduledDate || 'Not scheduled',
      isPartOfSeries: isPartOfSeries || false
    },
    generatedAt: new Date().toISOString()
  }
}

export const toolsConfig = {
  'title-hook': {
    name: 'Title & Hook Generator',
    description: 'Generate compelling video titles and opening hooks that grab attention',
    icon: 'Sparkles',
    fields: [
      { name: 'topic', label: 'Video Topic', type: 'text', required: true, placeholder: 'e.g., "Video editing for beginners"' },
      { name: 'niche', label: 'Your Niche', type: 'text', required: false, placeholder: 'e.g., "Tech tutorials"' },
      { name: 'targetAudience', label: 'Target Audience', type: 'text', required: false, placeholder: 'e.g., "Beginner content creators"' },
      { name: 'videoStyle', label: 'Video Style', type: 'select', options: ['Tutorial', 'Vlog', 'Review', 'Story', 'List'], required: false }
    ],
    generator: generateTitleHook
  },
  'script-outline': {
    name: 'Script Outline Builder',
    description: 'Create structured video scripts with timestamps and sections',
    icon: 'FileText',
    fields: [
      { name: 'topic', label: 'Video Topic', type: 'text', required: true, placeholder: 'e.g., "How to grow on YouTube"' },
      { name: 'videoLength', label: 'Video Length (minutes)', type: 'number', required: true, placeholder: '10' },
      { name: 'keyPoints', label: 'Key Points (comma-separated)', type: 'textarea', required: false, placeholder: 'Point 1, Point 2, Point 3' },
      { name: 'targetAudience', label: 'Target Audience', type: 'text', required: false, placeholder: 'e.g., "New YouTubers"' },
      { name: 'callToAction', label: 'Call to Action', type: 'text', required: false, placeholder: 'e.g., "Subscribe for weekly tips"' }
    ],
    generator: generateScriptOutline
  },
  'thumbnail-brief': {
    name: 'Thumbnail Brief Creator',
    description: 'Generate thumbnail concepts with text, visuals, and composition tips',
    icon: 'Image',
    fields: [
      { name: 'topic', label: 'Video Topic', type: 'text', required: true, placeholder: 'e.g., "iPhone vs Android"' },
      { name: 'emotion', label: 'Desired Emotion', type: 'select', options: ['Curiosity', 'Excitement', 'Shock', 'Trust', 'Fun'], required: false },
      { name: 'targetAudience', label: 'Target Audience', type: 'text', required: false, placeholder: 'e.g., "Tech enthusiasts"' },
      { name: 'competitorStyle', label: 'Competitor Reference', type: 'text', required: false, placeholder: 'e.g., "MKBHD style"' }
    ],
    generator: generateThumbnailBrief
  },
  'seo-toolkit': {
    name: 'SEO Toolkit',
    description: 'Generate optimized descriptions, tags, chapters, and pinned comments',
    icon: 'Search',
    fields: [
      { name: 'topic', label: 'Video Topic', type: 'text', required: true, placeholder: 'e.g., "React tutorial"' },
      { name: 'videoTitle', label: 'Video Title', type: 'text', required: false, placeholder: 'Your planned title' },
      { name: 'targetKeywords', label: 'Target Keywords (comma-separated)', type: 'textarea', required: false, placeholder: 'react, javascript, web development' },
      { name: 'videoLength', label: 'Video Length (minutes)', type: 'number', required: false, placeholder: '15' }
    ],
    generator: generateSeoToolkit
  },
  'upload-checklist': {
    name: 'Upload Checklist',
    description: 'Complete pre-publish, publish day, and post-publish checklists',
    icon: 'CheckSquare',
    fields: [
      { name: 'topic', label: 'Video Topic', type: 'text', required: true, placeholder: 'e.g., "My new video"' },
      { name: 'scheduledDate', label: 'Scheduled Date', type: 'text', required: false, placeholder: 'e.g., "June 15, 2025"' },
      { name: 'isPartOfSeries', label: 'Part of a Series?', type: 'select', options: ['Yes', 'No'], required: false }
    ],
    generator: generateUploadChecklist
  },
  'analytics-tracker': {
    name: 'Analytics Tracker',
    description: 'Track and analyze your video performance metrics',
    icon: 'BarChart3',
    comingSoon: true,
    fields: []
  }
}
