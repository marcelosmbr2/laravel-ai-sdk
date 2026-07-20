import { Link } from '@inertiajs/react';
import {
    AudioLines,
    Boxes,
    FileText,
    Image as ImageIcon,
    LayoutGrid,
    Library,
    MessageSquare,
    Mic,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import ai from '@/routes/ai';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const aiLabNavItems: NavItem[] = [
    {
        title: 'Prompt básico',
        href: ai.prompt(),
        icon: MessageSquare,
    },
    {
        title: 'Análise de arquivo',
        href: ai.files(),
        icon: FileText,
    },
    {
        title: 'Imagens',
        href: ai.images(),
        icon: ImageIcon,
    },
    {
        title: 'Áudio (TTS)',
        href: ai.audio(),
        icon: AudioLines,
    },
    {
        title: 'Transcrições (STT)',
        href: ai.transcription(),
        icon: Mic,
    },
    {
        title: 'Embeddings',
        href: ai.embeddings(),
        icon: Boxes,
    },
    {
        title: 'RAG',
        href: ai.rag(),
        icon: Library,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <NavMain items={aiLabNavItems} label="AI Lab" />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
