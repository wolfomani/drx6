"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Brain, Monitor, User, Globe, Server, Menu, ExternalLink, Github, Home, Settings, Network } from "lucide-react"

const navigationItems = [
  {
    title: "التطبيقات",
    items: [
      {
        title: "منصة الذكاء الاصطناعي",
        description: "تفاعل مع نماذج الذكاء الاصطناعي المتعددة",
        href: "https://drx6.vercel.app",
        icon: <Brain className="w-4 h-4" />,
        external: true,
      },
      {
        title: "منصة دكتور إكس",
        description: "تطبيق ويب متقدم مع ميزات شاملة",
        href: "https://drxor.vercel.app",
        icon: <Monitor className="w-4 h-4" />,
        external: true,
      },
      {
        title: "منصة عبدالعزيز",
        description: "محفظة شخصية وعرض المشاريع",
        href: "https://3bdulaziz.vercel.app",
        icon: <User className="w-4 h-4" />,
        external: true,
      },
      {
        title: "منصة عرب",
        description: "منصة مخصصة للمحتوى العربي",
        href: "https://3rb.vercel.app",
        icon: <Globe className="w-4 h-4" />,
        external: true,
      },
    ],
  },
  {
    title: "الأدوات",
    items: [
      {
        title: "واجهة برمجة التطبيقات",
        description: "خدمات API شاملة",
        href: "https://github.com/wolfomani/dr.x_API",
        icon: <Server className="w-4 h-4" />,
        external: true,
      },
      {
        title: "مركز التطبيقات",
        description: "لوحة تحكم موحدة لجميع التطبيقات",
        href: "#dashboard",
        icon: <Network className="w-4 h-4" />,
        external: false,
      },
    ],
  },
]

interface UnifiedNavbarProps {
  currentApp?: string
  onNavigate?: (section: string) => void
}

export function UnifiedNavbar({ currentApp, onNavigate }: UnifiedNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                <Network className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-white">مركز التطبيقات</h1>
                <p className="text-xs text-gray-400">WolfOmani Apps Hub</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
            <NavigationMenu>
              <NavigationMenuList className="space-x-2 rtl:space-x-reverse">
                {navigationItems.map((section) => (
                  <NavigationMenuItem key={section.title}>
                    <NavigationMenuTrigger className="bg-transparent hover:bg-gray-800 text-white">
                      {section.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {section.items.map((item) => (
                          <NavigationMenuLink key={item.title} asChild>
                            <a
                              href={item.href}
                              target={item.external ? "_blank" : "_self"}
                              rel={item.external ? "noopener noreferrer" : ""}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900"
                              onClick={!item.external ? () => onNavigate?.(item.href.replace("#", "")) : undefined}
                            >
                              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                {item.icon}
                                <div className="text-sm font-medium leading-none">{item.title}</div>
                                {item.external && <ExternalLink className="w-3 h-3" />}
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-gray-600">{item.description}</p>
                            </a>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-gray-800"
                onClick={() => window.open("https://github.com/wolfomani", "_blank")}
              >
                <Github className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-gray-800"
                onClick={() => onNavigate?.("settings")}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white">
                  <Menu className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>التطبيقات</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {navigationItems
                  .flatMap((section) => section.items)
                  .map((item) => (
                    <DropdownMenuItem
                      key={item.title}
                      onClick={() => {
                        if (item.external) {
                          window.open(item.href, "_blank")
                        } else {
                          onNavigate?.(item.href.replace("#", ""))
                        }
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        {item.icon}
                        <span>{item.title}</span>
                        {item.external && <ExternalLink className="w-3 h-3" />}
                      </div>
                    </DropdownMenuItem>
                  ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.open("https://github.com/wolfomani", "_blank")}>
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Current App Indicator */}
      {currentApp && (
        <div className="border-t border-gray-800 bg-gray-800/50">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Badge variant="outline" className="text-xs">
                  التطبيق الحالي
                </Badge>
                <span className="text-sm text-gray-300">{currentApp}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-gray-400 hover:text-white"
                onClick={() => onNavigate?.("dashboard")}
              >
                <Home className="w-3 h-3 mr-1" />
                العودة للرئيسية
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
