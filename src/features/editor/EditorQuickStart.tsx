import React, { useState } from 'react';
import { Layers, Type, Download, RefreshCw, Palette } from 'lucide-react';
import { useTemplateStore } from '../../stores/useTemplateStore';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';

export const EditorQuickStart: React.FC = () => {
  const selectedTemplate = useTemplateStore((state) => state.selectedTemplate);
  const setSelectedTemplate = useTemplateStore((state) => state.setSelectedTemplate);

  // Quick live interactive preview states
  const [topText, setTopText] = useState('WHEN THE CODE COMPILES');
  const [bottomText, setBottomText] = useState('ON THE FIRST TRY');
  const [textColor, setTextColor] = useState('#ffffff');
  const [isUppercase, setIsUppercase] = useState(true);

  return (
    <section id="create" className="scroll-mt-24 space-y-8" aria-label="Meme Creator Workspace">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Interactive Creator Canvas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Meme Studio Preview
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            {selectedTemplate
              ? `Currently editing "${selectedTemplate.name}". Real-time text rendering powered by client state.`
              : 'Pick any template from the gallery below to load into the workspace.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="primary" size="md">
            Day 2 Roadmap: HTML5 Canvas + WebGL Export
          </Badge>
        </div>
      </div>

      {selectedTemplate ? (
        /* Active Selected Template Workspace */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Canvas Render Area */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="relative w-full max-w-lg bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-4 flex flex-col items-center justify-center">
              <div className="relative w-full overflow-hidden rounded-xl bg-slate-900 group">
                <img
                  src={selectedTemplate.imageUrl}
                  alt={selectedTemplate.name}
                  className="w-full h-auto object-contain max-h-[460px] mx-auto select-none"
                />

                {/* Simulated Meme Top Text Overlay */}
                <div
                  className="absolute top-4 inset-x-4 text-center pointer-events-none select-none font-extrabold px-2 break-words"
                  style={{
                    color: textColor,
                    textTransform: isUppercase ? 'uppercase' : 'none',
                    textShadow:
                      '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 2px 0 #000, 2px 0 0 #000, 0 -2px 0 #000, -2px 0 0 #000',
                    fontSize: 'clamp(1.1rem, 3.5vw, 2.2rem)',
                    lineHeight: 1.1,
                    fontFamily: "'Space Grotesk', Impact, sans-serif",
                  }}
                >
                  {topText}
                </div>

                {/* Simulated Meme Bottom Text Overlay */}
                <div
                  className="absolute bottom-4 inset-x-4 text-center pointer-events-none select-none font-extrabold px-2 break-words"
                  style={{
                    color: textColor,
                    textTransform: isUppercase ? 'uppercase' : 'none',
                    textShadow:
                      '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 2px 0 #000, 2px 0 0 #000, 0 -2px 0 #000, -2px 0 0 #000',
                    fontSize: 'clamp(1.1rem, 3.5vw, 2.2rem)',
                    lineHeight: 1.1,
                    fontFamily: "'Space Grotesk', Impact, sans-serif",
                  }}
                >
                  {bottomText}
                </div>
              </div>

              {/* Status bar */}
              <div className="w-full mt-3 flex items-center justify-between text-xs text-slate-500 font-mono px-1">
                <span>
                  {selectedTemplate.width} × {selectedTemplate.height} px
                </span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Preview Synchronized
                </span>
              </div>
            </div>
          </div>

          {/* Controls Sidebar */}
          <div className="lg:col-span-5 space-y-5">
            <Card className="p-6 space-y-5 border-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Type className="w-4 h-4 text-indigo-400" />
                  <span>Layer Text Controls</span>
                </div>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="text-xs text-slate-400 hover:text-white transition-all duration-150 active:scale-95 cursor-pointer px-2 py-1 rounded-lg hover:bg-slate-800"
                >
                  Change Template
                </button>
              </div>

              {/* Top Text Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="editor-top-text"
                  className="text-xs font-semibold text-slate-300 flex items-center justify-between"
                >
                  <span>Top Caption</span>
                  <span className="text-[10px] text-slate-500 font-normal">Layer #1</span>
                </label>
                <input
                  id="editor-top-text"
                  type="text"
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  placeholder="Enter top text..."
                  className="w-full bg-slate-950 text-slate-100 placeholder:text-slate-600 rounded-xl border border-slate-800 px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Bottom Text Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="editor-bottom-text"
                  className="text-xs font-semibold text-slate-300 flex items-center justify-between"
                >
                  <span>Bottom Caption</span>
                  <span className="text-[10px] text-slate-500 font-normal">Layer #2</span>
                </label>
                <input
                  id="editor-bottom-text"
                  type="text"
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  placeholder="Enter bottom text..."
                  className="w-full bg-slate-950 text-slate-100 placeholder:text-slate-600 rounded-xl border border-slate-800 px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Styling Options */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-300 font-medium">Text Color</span>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-7 h-7 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                    title="Choose text color"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setIsUppercase(!isUppercase)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-150 active:scale-95 cursor-pointer hover:-translate-y-0.5 ${
                    isUppercase
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  ALL CAPS: {isUppercase ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Day 2 Action notice */}
              <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-300 space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  Day 1 State Integration Verified
                </p>
                <p className="text-slate-400 text-[11px]">
                  Template data and real-time caption inputs synchronize via React & Zustand state.
                  Multi-box dragging, font selection, and direct PNG/JPEG canvas export are scheduled
                  for Day 2.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <Button
                  variant="primary"
                  size="md"
                  className="flex-1"
                  leftIcon={<Download className="w-4 h-4" />}
                  onClick={() => {
                    alert(
                      `Template "${selectedTemplate.name}" with captions queued! High-resolution Canvas export will be activated in Day 2.`
                    );
                  }}
                >
                  Generate Meme (Preview)
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setTopText('');
                    setBottomText('');
                  }}
                  title="Clear text inputs"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        /* Empty / Prompt to Select Template */
        <Card className="p-8 sm:p-12 text-center border-dashed border-slate-800 bg-slate-900/30">
          <div className="max-w-md mx-auto flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Layers className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">No Template Selected Yet</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Click on any meme card in the template gallery below to load it into the real-time
                editor canvas.
              </p>
            </div>
            <a href="#templates">
              <Button
                variant="primary"
                size="md"
                leftIcon={<Layers className="w-4 h-4" />}
              >
                Browse Meme Templates
              </Button>
            </a>
          </div>
        </Card>
      )}
    </section>
  );
};
