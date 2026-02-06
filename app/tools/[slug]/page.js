'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toolsConfig } from '@/lib/generators'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Youtube, ArrowLeft, Copy, Check, Loader2, LogIn, Sparkles, FileText, Image, Search, CheckSquare, BarChart3, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

const toolIcons = {
  'title-hook': Sparkles,
  'script-outline': FileText,
  'thumbnail-brief': Image,
  'seo-toolkit': Search,
  'upload-checklist': CheckSquare,
  'analytics-tracker': BarChart3,
}

export default function ToolPage() {
  const params = useParams()
  const slug = params.slug
  const tool = toolsConfig[slug]
  
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({})
  const [result, setResult] = useState(null)
  const [remainingUses, setRemainingUses] = useState(null)
  const [copiedField, setCopiedField] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch(`/api/tools/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed')
      }

      setResult(data.output)
      setRemainingUses(data.remainingUses)
      toast.success('Generated successfully!')
    } catch (error) {
      console.error('Generation error:', error)
      toast.error(error.message || 'Failed to generate')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text, field) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(field)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopiedField(null), 2000)
  }

  if (!tool || tool.comingSoon) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white flex items-center justify-center">
        <Card className="bg-gray-800/50 border-gray-700 max-w-md">
          <CardContent className="pt-6 text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-500" />
            <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
            <p className="text-gray-400 mb-4">This tool is currently under development.</p>
            <Link href="/tools">
              <Button variant="outline">Back to Tools</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const Icon = toolIcons[slug] || Sparkles

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/tools" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Link>
              <div className="h-6 w-px bg-gray-700" />
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Youtube className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg hidden md:block">Creator Toolkit YouTube</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              {remainingUses !== null && remainingUses !== '∞' && (
                <Badge variant="outline" className="border-gray-700 text-gray-300">
                  {remainingUses} uses left today
                </Badge>
              )}
              {user ? (
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">Dashboard</Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button size="sm" className="bg-gradient-to-r from-red-500 to-pink-500">
                    <LogIn className="w-4 h-4 mr-2" /> Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Not logged in banner */}
      {!user && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/20 py-2">
          <div className="container mx-auto px-4 flex items-center justify-center gap-2 text-yellow-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Results won&apos;t be saved to history.</span>
            <Link href="/login" className="underline hover:no-underline">Login to save results</Link>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <div>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white">{tool.name}</CardTitle>
                    <CardDescription className="text-gray-400">{tool.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {tool.fields.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <Label htmlFor={field.name} className="text-gray-300">
                        {field.label}
                        {field.required && <span className="text-red-400 ml-1">*</span>}
                      </Label>
                      {field.type === 'select' ? (
                        <Select
                          value={formData[field.name] || ''}
                          onValueChange={(value) => handleInputChange(field.name, value)}
                        >
                          <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                            <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options.map((option) => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : field.type === 'textarea' ? (
                        <Textarea
                          id={field.name}
                          placeholder={field.placeholder}
                          value={formData[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          required={field.required}
                          className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 min-h-[100px]"
                        />
                      ) : (
                        <Input
                          id={field.name}
                          type={field.type}
                          placeholder={field.placeholder}
                          value={formData[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          required={field.required}
                          className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                        />
                      )}
                    </div>
                  ))}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                    disabled={loading}
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
                    ) : (
                      <><Sparkles className="w-4 h-4 mr-2" /> Generate</>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right: Results */}
          <div>
            {result ? (
              <ResultsDisplay slug={slug} result={result} copyToClipboard={copyToClipboard} copiedField={copiedField} />
            ) : (
              <Card className="bg-gray-800/50 border-gray-700 h-full min-h-[400px] flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <Icon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <h3 className="text-lg font-medium text-gray-400 mb-2">Ready to generate</h3>
                  <p className="text-gray-500">Fill out the form and click Generate to see results here</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// CopyButton component moved outside to avoid recreation during render
function CopyButton({ text, field, copyToClipboard, copiedField }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => copyToClipboard(text, field)}
      className="text-gray-400 hover:text-white"
    >
      {copiedField === field ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </Button>
  )
}

// Results display component
function ResultsDisplay({ slug, result, copyToClipboard, copiedField }) {

  if (slug === 'title-hook') {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Generated Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="titles" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-900">
              <TabsTrigger value="titles">Titles ({result.titles?.length || 0})</TabsTrigger>
              <TabsTrigger value="hooks">Hooks ({result.hooks?.length || 0})</TabsTrigger>
            </TabsList>
            <TabsContent value="titles" className="mt-4 space-y-3">
              {result.titles?.map((item, i) => (
                <div key={i} className="p-3 bg-gray-900 rounded-lg">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-white font-medium">{item.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs border-gray-700">{item.style}</Badge>
                        <span className="text-xs text-gray-500">{item.tip}</span>
                      </div>
                    </div>
                    <CopyButton text={item.title} field={`title-${i}`} copyToClipboard={copyToClipboard} copiedField={copiedField} />
                  </div>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="hooks" className="mt-4 space-y-3">
              {result.hooks?.map((item, i) => (
                <div key={i} className="p-3 bg-gray-900 rounded-lg">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-white">{item.hook}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs border-gray-700">{item.type}</Badge>
                        <span className="text-xs text-gray-500">{item.bestFor}</span>
                      </div>
                    </div>
                    <CopyButton text={item.hook} field={`hook-${i}`} copyToClipboard={copyToClipboard} copiedField={copiedField} />
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    )
  }

  if (slug === 'script-outline') {
    return (
      <Card className="bg-gray-800/50 border-gray-700 max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-white">Script Outline</CardTitle>
          <CardDescription className="text-gray-400">
            {result.metadata?.totalLength} • {result.metadata?.sectionCount} sections
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Intro */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-blue-500">Intro</Badge>
              <span className="text-gray-400 text-sm">{result.intro?.timestamp} • {result.intro?.duration}</span>
            </div>
            <div className="space-y-2">
              {result.intro?.elements?.map((el, i) => (
                <div key={i} className="p-2 bg-gray-900 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-red-400 text-sm font-medium">{el.type}</span>
                    <CopyButton text={el.content} field={`intro-${i}`} copyToClipboard={copyToClipboard} copiedField={copiedField} />
                  </div>
                  <p className="text-white text-sm mt-1">{el.content}</p>
                  <p className="text-gray-500 text-xs mt-1">💡 {el.tips}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sections */}
          {result.sections?.map((section, idx) => (
            <div key={idx}>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-purple-500">Section {section.number}</Badge>
                <span className="text-white font-medium">{section.title}</span>
              </div>
              <span className="text-gray-400 text-sm">{section.timestamp} • {section.duration}</span>
              <div className="space-y-2 mt-2">
                {section.elements?.map((el, i) => (
                  <div key={i} className="p-2 bg-gray-900 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-red-400 text-sm font-medium">{el.type}</span>
                      <CopyButton text={el.content} field={`section-${idx}-${i}`} copyToClipboard={copyToClipboard} copiedField={copiedField} />
                    </div>
                    <p className="text-white text-sm mt-1">{el.content}</p>
                    <p className="text-gray-500 text-xs mt-1">💡 {el.tips}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* CTA */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-green-500">CTA</Badge>
              <span className="text-gray-400 text-sm">{result.cta?.timestamp} • {result.cta?.duration}</span>
            </div>
            <div className="space-y-2">
              {result.cta?.elements?.map((el, i) => (
                <div key={i} className="p-2 bg-gray-900 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-red-400 text-sm font-medium">{el.type}</span>
                    <CopyButton text={el.content} field={`cta-${i}`} copyToClipboard={copyToClipboard} copiedField={copiedField} />
                  </div>
                  <p className="text-white text-sm mt-1">{el.content}</p>
                  <p className="text-gray-500 text-xs mt-1">💡 {el.tips}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Chapters */}
          <div>
            <h4 className="text-white font-medium mb-2">YouTube Chapters</h4>
            <div className="p-3 bg-gray-900 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Copy for description</span>
                <CopyButton 
                  text={result.chapters?.map(c => `${c.time} ${c.title}`).join('\n')} 
                  field="chapters" 
                  copyToClipboard={copyToClipboard}
                  copiedField={copiedField}
                />
              </div>
              <div className="text-sm text-gray-300 font-mono space-y-1">
                {result.chapters?.map((ch, i) => (
                  <div key={i}>{ch.time} {ch.title}</div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (slug === 'thumbnail-brief') {
    return (
      <Card className="bg-gray-800/50 border-gray-700 max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-white">Thumbnail Brief</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-900">
              <TabsTrigger value="text">Text Options</TabsTrigger>
              <TabsTrigger value="visual">Visual</TabsTrigger>
              <TabsTrigger value="color">Colors</TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="mt-4 space-y-3">
              {result.textOptions?.map((item, i) => (
                <div key={i} className="p-3 bg-gray-900 rounded-lg">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-white font-bold text-lg">{item.text}</p>
                      <p className="text-gray-400 text-sm">Style: {item.style}</p>
                      <p className="text-gray-500 text-sm">Placement: {item.placement}</p>
                    </div>
                    <CopyButton text={item.text} field={`text-${i}`} copyToClipboard={copyToClipboard} copiedField={copiedField} />
                  </div>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="visual" className="mt-4 space-y-4">
              {result.visualConcepts?.map((concept, i) => (
                <div key={i} className="p-4 bg-gray-900 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">{concept.concept}</h4>
                  <p className="text-gray-400 text-sm mb-2">{concept.description}</p>
                  <ul className="space-y-1">
                    {concept.elements?.map((el, j) => (
                      <li key={j} className="text-gray-300 text-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        {el}
                      </li>
                    ))}
                  </ul>
                  <p className="text-gray-500 text-xs mt-2">Best for: {concept.bestFor}</p>
                </div>
              ))}
              <div className="p-4 bg-gray-900 rounded-lg">
                <h4 className="text-white font-semibold mb-2">Composition Tips</h4>
                <ul className="space-y-2">
                  {result.compositionTips?.map((tip, i) => (
                    <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="color" className="mt-4 space-y-4">
              {result.colorMoods?.map((mood, i) => (
                <div key={i} className="p-4 bg-gray-900 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">{mood.mood}</h4>
                  <div className="flex gap-2 mb-2">
                    {mood.colors?.map((color, j) => (
                      <Badge key={j} variant="outline" className="border-gray-700">{color}</Badge>
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm">Effect: {mood.effect}</p>
                </div>
              ))}
              <div className="p-4 bg-gray-900 rounded-lg">
                <h4 className="text-white font-semibold mb-2">Technical Specs</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-400">Dimensions:</div>
                  <div className="text-white">{result.technicalSpecs?.dimensions}</div>
                  <div className="text-gray-400">Aspect Ratio:</div>
                  <div className="text-white">{result.technicalSpecs?.aspectRatio}</div>
                  <div className="text-gray-400">Format:</div>
                  <div className="text-white">{result.technicalSpecs?.format}</div>
                  <div className="text-gray-400">Max Size:</div>
                  <div className="text-white">{result.technicalSpecs?.maxSize}</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    )
  }

  if (slug === 'seo-toolkit') {
    return (
      <Card className="bg-gray-800/50 border-gray-700 max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-white">SEO Toolkit Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-900">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="tags">Tags</TabsTrigger>
              <TabsTrigger value="chapters">Chapters</TabsTrigger>
              <TabsTrigger value="comment">Comment</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <div className="p-4 bg-gray-900 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-semibold">Video Description</h4>
                  <CopyButton text={result.description?.full} field="description" copyToClipboard={copyToClipboard} copiedField={copiedField} />
                </div>
                <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans">{result.description?.full}</pre>
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <h5 className="text-gray-400 text-sm font-medium mb-2">Tips:</h5>
                  <ul className="space-y-1">
                    {result.description?.tips?.map((tip, i) => (
                      <li key={i} className="text-gray-500 text-sm">• {tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="tags" className="mt-4">
              <div className="p-4 bg-gray-900 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-semibold">Video Tags</h4>
                  <CopyButton text={result.tags?.list?.join(', ')} field="tags" copyToClipboard={copyToClipboard} copiedField={copiedField} />
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {result.tags?.list?.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="bg-gray-800">{tag}</Badge>
                  ))}
                </div>
                <div className="pt-4 border-t border-gray-800">
                  <h5 className="text-gray-400 text-sm font-medium mb-2">Tips:</h5>
                  <ul className="space-y-1">
                    {result.tags?.tips?.map((tip, i) => (
                      <li key={i} className="text-gray-500 text-sm">• {tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="chapters" className="mt-4">
              <div className="p-4 bg-gray-900 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-semibold">YouTube Chapters</h4>
                  <CopyButton 
                    text={result.chapters?.map(c => `${c.time} - ${c.title}`).join('\n')} 
                    field="seo-chapters" 
                    copyToClipboard={copyToClipboard}
                    copiedField={copiedField}
                  />
                </div>
                <div className="space-y-2">
                  {result.chapters?.map((ch, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-red-400 font-mono text-sm w-12">{ch.time}</span>
                      <span className="text-white text-sm">{ch.title}</span>
                      {ch.tip && <span className="text-gray-500 text-xs">({ch.tip})</span>}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="comment" className="mt-4">
              <div className="p-4 bg-gray-900 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-semibold">Pinned Comment</h4>
                  <CopyButton text={result.pinnedComment?.text} field="pinned" copyToClipboard={copyToClipboard} copiedField={copiedField} />
                </div>
                <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans">{result.pinnedComment?.text}</pre>
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <h5 className="text-gray-400 text-sm font-medium mb-2">Tips:</h5>
                  <ul className="space-y-1">
                    {result.pinnedComment?.tips?.map((tip, i) => (
                      <li key={i} className="text-gray-500 text-sm">• {tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    )
  }

  if (slug === 'upload-checklist') {
    return (
      <Card className="bg-gray-800/50 border-gray-700 max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-white">Upload Checklist</CardTitle>
          <CardDescription className="text-gray-400">
            {result.videoDetails?.topic} • {result.videoDetails?.scheduledDate}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pre" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-900">
              <TabsTrigger value="pre">Pre-Publish</TabsTrigger>
              <TabsTrigger value="day">Publish Day</TabsTrigger>
              <TabsTrigger value="post">Post-Publish</TabsTrigger>
            </TabsList>
            <TabsContent value="pre" className="mt-4 space-y-2">
              {result.prePublish?.map((item, i) => (
                <div key={i} className="p-3 bg-gray-900 rounded-lg flex items-start gap-3">
                  <div className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 ${item.critical ? 'border-red-500' : 'border-gray-600'}`} />
                  <div>
                    <p className="text-white text-sm font-medium">{item.task}</p>
                    <p className="text-gray-500 text-xs">{item.details}</p>
                    {item.critical && <Badge className="mt-1 bg-red-500/20 text-red-400 text-xs">Critical</Badge>}
                  </div>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="day" className="mt-4 space-y-2">
              {result.publishDay?.map((item, i) => (
                <div key={i} className="p-3 bg-gray-900 rounded-lg flex items-start gap-3">
                  <div className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 ${item.critical ? 'border-red-500' : 'border-gray-600'}`} />
                  <div>
                    <p className="text-white text-sm font-medium">{item.task}</p>
                    <p className="text-gray-500 text-xs">{item.details}</p>
                    {item.critical && <Badge className="mt-1 bg-red-500/20 text-red-400 text-xs">Critical</Badge>}
                  </div>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="post" className="mt-4 space-y-2">
              {result.postPublish?.map((item, i) => (
                <div key={i} className="p-3 bg-gray-900 rounded-lg flex items-start gap-3">
                  <div className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 ${item.critical ? 'border-red-500' : 'border-gray-600'}`} />
                  <div>
                    <p className="text-white text-sm font-medium">{item.task}</p>
                    <p className="text-gray-500 text-xs">{item.details}</p>
                    {item.timing && <span className="text-gray-600 text-xs">⏰ {item.timing}</span>}
                    {item.critical && <Badge className="mt-1 bg-red-500/20 text-red-400 text-xs">Critical</Badge>}
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>

          <div className="mt-6 p-4 bg-gray-900 rounded-lg">
            <h4 className="text-white font-semibold mb-2">Best Practices</h4>
            <ul className="space-y-2">
              {result.bestPractices?.map((tip, i) => (
                <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                  <span className="text-red-400">💡</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default fallback
  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Results</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="text-gray-300 text-sm overflow-auto">{JSON.stringify(result, null, 2)}</pre>
      </CardContent>
    </Card>
  )
}
