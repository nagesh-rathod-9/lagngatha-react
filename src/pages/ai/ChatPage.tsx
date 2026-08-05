import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, Plus, Search, Sparkles, ChevronDown,
  Copy, ThumbsUp, ThumbsDown, RefreshCw, Paperclip, Menu, X,
} from 'lucide-react'
import { Button, Input, Avatar } from '@/components/ui'
import { conversations, initialMessages } from '@/data/messages'
import { cn } from '@/utils/cn'
import type { ChatMessage } from '@/types'

const models = ['claude-sonnet-4-6', 'claude-opus-4-8', 'gpt-4o'] as const
type Model = typeof models[number]

function MarkdownMessage({ content }: { content: string }) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      elements.push(<p key={i} className="font-semibold text-slate-100 mt-3 mb-1">{line.slice(2, -2)}</p>)
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <li key={i} className="ml-4 text-slate-300 list-disc marker:text-orbit-primary">
          {formatInline(line.slice(2))}
        </li>
      )
    } else if (line.startsWith('| ') && line.includes('|')) {
      const rows: string[][] = []
      while (i < lines.length && lines[i].startsWith('|')) {
        if (!lines[i].match(/^\|[-| :]+\|$/)) {
          rows.push(lines[i].split('|').filter(Boolean).map(c => c.trim()))
        }
        i++
      }
      elements.push(
        <div key={`table-${i}`} className="overflow-x-auto my-2 rounded-lg border border-orbit-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-orbit-border bg-orbit-surface2">
                {rows[0]?.map((h, j) => (
                  <th key={j} className="px-3 py-2 text-left font-semibold text-slate-300">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(1).map((row, j) => (
                <tr key={j} className="border-b border-orbit-border last:border-0 hover:bg-white/2">
                  {row.map((cell, k) => (
                    <td key={k} className="px-3 py-2 text-slate-400">{formatInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      continue
    } else if (line.trim() === '') {
      elements.push(<div key={i} className="h-1" />)
    } else {
      elements.push(<p key={i} className="text-slate-300 leading-relaxed">{formatInline(line)}</p>)
    }
    i++
  }

  return <div className="text-sm space-y-0.5">{elements}</div>
}

function formatInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} className="font-semibold text-slate-100">{part.slice(2, -2)}</strong>
      : part
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-orbit-primary"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
        />
      ))}
    </div>
  )
}

function MessageActions() {
  return (
    <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
      {[
        { icon: Copy, label: 'Copy' },
        { icon: ThumbsUp, label: 'Good response' },
        { icon: ThumbsDown, label: 'Bad response' },
        { icon: RefreshCw, label: 'Regenerate' },
      ].map(({ icon: Icon, label }) => (
        <button
          key={label}
          title={label}
          className="p-1.5 rounded-md text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors"
        >
          <Icon className="w-3.5 h-3.5" />
        </button>
      ))}
    </div>
  )
}

export function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [model, setModel] = useState<Model>('claude-sonnet-4-6')
  const [showModelPicker, setShowModelPicker] = useState(false)
  const [activeConv, setActiveConv] = useState('1')
  const [showConvList, setShowConvList] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages(m => [...m, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'm analyzing your request: **"${userMsg.content}"**\n\nThis is a demo response. To connect real AI capabilities, see the [API integration docs](/docs/api-integration/overview.md) in this repository — they contain structured context you can paste directly into Claude or ChatGPT to wire up your backend in minutes.\n\n**Quick integration steps:**\n- Choose your model (Claude recommended for business analytics)\n- Pass your dashboard context in the system prompt\n- Stream responses for the best UX`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages(m => [...m, aiMsg])
    }, 1800)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleNewChat = () => {
    setMessages([])
    setActiveConv(Date.now().toString())
    setShowConvList(false)
  }

  return (
    <div className="flex h-screen bg-orbit-bg overflow-hidden">
      {/* Conversation list — desktop: static column, mobile: overlay drawer */}
      <AnimatePresence>
        {(showConvList || true) && (
          <motion.aside
            initial={false}
            animate={{
              width: showConvList ? 280 : 0,
            }}
            className="hidden md:flex flex-col border-r border-orbit-border bg-orbit-surface overflow-hidden flex-shrink-0"
          >
            <ConversationList
              activeConv={activeConv}
              onSelect={(id) => setActiveConv(id)}
              onNewChat={handleNewChat}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {showConvList && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConvList(false)}
              className="md:hidden fixed inset-0 bg-black/50 z-40"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="md:hidden fixed left-0 top-0 h-screen w-72 bg-orbit-surface border-r border-orbit-border z-50 flex flex-col"
            >
              <div className="flex items-center justify-between px-3 py-3 border-b border-orbit-border">
                <span className="text-sm font-semibold text-slate-200">Conversations</span>
                <button
                  onClick={() => setShowConvList(false)}
                  className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-white/5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ConversationList
                activeConv={activeConv}
                onSelect={(id) => {
                  setActiveConv(id)
                  setShowConvList(false)
                }}
                onNewChat={handleNewChat}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main chat column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-orbit-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConvList(v => !v)}
              className="p-2 rounded-md text-slate-400 hover:text-slate-200 hover:bg-white/5 md:hidden"
            >
              <Menu className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowConvList(v => !v)}
              className="p-2 rounded-md text-slate-400 hover:text-slate-200 hover:bg-white/5 hidden md:flex"
              title="Toggle conversations"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Model picker */}
            <div className="relative">
              <button
                onClick={() => setShowModelPicker(v => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-orbit-primary-light" />
                {model}
                <ChevronDown className={cn('w-3.5 h-3.5 text-slate-500 transition-transform', showModelPicker && 'rotate-180')} />
              </button>

              <AnimatePresence>
                {showModelPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-56 rounded-lg border border-orbit-border bg-orbit-surface shadow-lg overflow-hidden z-30"
                  >
                    {models.map(m => (
                      <button
                        key={m}
                        onClick={() => {
                          setModel(m)
                          setShowModelPicker(false)
                        }}
                        className={cn(
                          'w-full text-left px-3 py-2 text-sm transition-colors',
                          m === model
                            ? 'text-orbit-primary-light bg-orbit-primary/10'
                            : 'text-slate-300 hover:bg-white/5'
                        )}
                      >
                        {m}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <Button variant="ghost" size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={handleNewChat}>
            New chat
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center py-20">
                <div className="w-12 h-12 rounded-xl bg-orbit-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-orbit-primary-light" />
                </div>
                <p className="text-slate-300 font-medium">Start a new conversation</p>
                <p className="text-sm text-slate-500 mt-1">Ask a question or describe what you need help with.</p>
              </div>
            )}

            {messages.map(msg => (
              <div
                key={msg.id}
                className={cn(
                  'flex gap-3 group',
                  msg.role === 'user' && 'flex-row-reverse'
                )}
              >
                <Avatar
                  initials={msg.role === 'user' ? 'A' : 'AI'}
                  size="sm"
                />
                <div className={cn('flex-1 min-w-0', msg.role === 'user' && 'flex flex-col items-end')}>
                  <div
                    className={cn(
                      'inline-block rounded-2xl px-4 py-2.5 max-w-[85%]',
                      msg.role === 'user'
                        ? 'bg-orbit-primary/15 text-slate-100'
                        : 'bg-orbit-surface2 border border-orbit-border'
                    )}
                  >
                    {msg.role === 'assistant' ? (
                      <MarkdownMessage content={msg.content} />
                    ) : (
                      <p className="text-sm text-slate-100 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                  <div className={cn('flex items-center gap-2 mt-1', msg.role === 'user' && 'flex-row-reverse')}>
                    <span className="text-[11px] text-slate-600">{msg.timestamp}</span>
                  </div>
                  {msg.role === 'assistant' && <MessageActions />}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <Avatar initials="AI" size="sm" />
                <div className="rounded-2xl px-4 py-2.5 bg-orbit-surface2 border border-orbit-border">
                  <TypingIndicator />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Composer */}
        <div className="border-t border-orbit-border px-4 py-4 flex-shrink-0">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2 rounded-2xl border border-orbit-border bg-orbit-surface2 px-3 py-2 focus-within:border-orbit-primary/50 transition-colors">
              <button
                className="p-2 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors flex-shrink-0"
                title="Attach file"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message the assistant..."
                className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-600 outline-none py-1.5"
              />

              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className={cn(
                  'p-2 rounded-lg transition-colors flex-shrink-0',
                  input.trim()
                    ? 'bg-orbit-primary text-white hover:bg-orbit-primary/90'
                    : 'bg-white/5 text-slate-600 cursor-not-allowed'
                )}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-center text-slate-600 mt-2">
              AI responses may be inaccurate. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ConversationList({
  activeConv,
  onSelect,
  onNewChat,
}: {
  activeConv: string
  onSelect: (id: string) => void
  onNewChat: () => void
}) {
  const [query, setQuery] = useState('')

  const filtered = conversations.filter((c: any) =>
    (c.title ?? '').toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full w-72">
      <div className="p-3 border-b border-orbit-border space-y-2">
        <Button
          variant="secondary"
          size="sm"
          className="w-full justify-center"
          icon={<Plus className="w-3.5 h-3.5" />}
          onClick={onNewChat}
        >
          New chat
        </Button>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e: any) => setQuery(e.target.value)}
            placeholder="Search conversations"
            className="pl-8 text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {filtered.map((conv: any) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={cn(
              'w-full text-left px-3 py-2.5 rounded-lg transition-colors',
              conv.id === activeConv
                ? 'bg-orbit-primary/10 text-slate-100'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            )}
          >
            <p className="text-sm font-medium truncate">{conv.title}</p>
            {conv.preview && (
              <p className="text-xs text-slate-500 truncate mt-0.5">{conv.preview}</p>
            )}
          </button>
        ))}

        {filtered.length === 0 && (
          <p className="text-xs text-slate-600 text-center py-6">No conversations found</p>
        )}
      </div>
    </div>
  )
}