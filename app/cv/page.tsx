"use client"

import ProfessionalCV from "@/components/professional-cv"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone, MapPin, Github, Globe, Calendar, Award, Code, Database, Brain, Zap, Users, TrendingUp, ExternalLink, Download, ArrowLeft } from 'lucide-react'

export default function CVPage() {
  return (
    <div>
      <ProfessionalCV />
      {/* Additional components or logic can be added here */}
    </div>
  )
}
