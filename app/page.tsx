'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import './styles.css'
import { BrandIcon } from '@/components/icons'

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Animated background */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-neutral-900 opacity-90" />
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Animated branch lines */}
          <svg className="w-full h-full opacity-50" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Main branch */}
            <path 
              className="animate-dash-15s stroke-[0.4] stroke-blue-500/50" 
              d="M20,50 L40,50 Q45,50 45,45 L45,30 Q45,25 50,25 L80,25" 
              fill="none" 
              strokeLinecap="round"
              strokeDasharray="0.5 2"
              pathLength="1"
            />
            {/* Branch 1 */}
            <path 
              className="animate-dash-20s stroke-[0.4] stroke-purple-500/50" 
              d="M20,50 L40,50 Q45,50 45,55 L45,70 Q45,75 50,75 L80,75" 
              fill="none" 
              strokeLinecap="round"
              strokeDasharray="0.5 2"
              pathLength="1"
            />
            {/* Branch 2 */}
            <path 
              className="animate-dash-25s stroke-[0.4] stroke-pink-500/50" 
              d="M45,50 L60,50 Q65,50 65,45 L65,35 Q65,30 70,30 L80,30" 
              fill="none" 
              strokeLinecap="round"
              strokeDasharray="0.5 2"
              pathLength="1"
            />
            {/* Branch 3 */}
            <path 
              className="animate-dash-30s stroke-[0.4] stroke-emerald-500/50" 
              d="M45,50 L60,50 Q65,50 65,55 L65,65 Q65,70 70,70 L80,70" 
              fill="none" 
              strokeLinecap="round"
              strokeDasharray="0.5 2"
              pathLength="1"
            />
          </svg>
        </div>
        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-1/3 -right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Navigation */}
      <nav className="fixed w-full p-6 z-50 mix-blend-difference">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white/90 font-bold text-xl tracking-tight flex items-center gap-2">
            <BrandIcon size={24} />
            branchGPT
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-white hover:text-white/90 hover:bg-white/10 transition-colors">
                Login
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" className="text-white hover:text-white/90 hover:bg-white/10 border-white/20 transition-colors">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative container mx-auto px-4 pt-32 pb-16 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <h1 className="text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/80 tracking-tight">
              Branch Your AI Conversations
            </h1>
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full filter blur-2xl opacity-20" />
          </div>
          <p className="text-xl mb-12 text-neutral-400 leading-relaxed max-w-2xl mx-auto">
            Explore multiple conversation paths simultaneously. Never lose context. 
            Find the perfect response every time.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button size="lg" className="bg-white text-black hover:bg-white/90 transition-colors px-8 py-6 text-lg rounded-2xl">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-40 grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Branch Conversations",
              description: "Create multiple conversation paths from any point, exploring different directions simultaneously."
            },
            {
              title: "Never Lose Context",
              description: "Keep your conversation history organized with our intuitive branching system."
            },
            {
              title: "Efficient Exploration",
              description: "Compare different approaches side by side to find the perfect solution."
            }
          ].map((feature, i) => (
            <div key={i} className="group p-8 rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-500" />
                <h3 className="relative text-xl font-semibold mb-3 text-white/90">{feature.title}</h3>
              </div>
              <p className="text-neutral-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 