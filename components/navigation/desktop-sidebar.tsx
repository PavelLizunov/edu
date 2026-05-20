import { getAllTopics } from "@/lib/content";
import { CATEGORIES } from "@/lib/categories";
import { SidebarLink } from "@/components/navigation/sidebar-link";

export async function DesktopSidebar() {
  const topics = await getAllTopics();

  return (
    <aside className="sidebar" aria-label="Навигация по темам">
      <h4 className="sidebar-eyebrow">edu</h4>
      <ul className="sidebar-list">
        <li>
          <SidebarLink href="/">Главная</SidebarLink>
        </li>
      </ul>

      {CATEGORIES.map((cat) => {
        const list = topics.filter((t) => t.category === cat.slug);
        return (
          <div key={cat.slug}>
            <h4 className="sidebar-eyebrow">{cat.slug}</h4>
            <ul className="sidebar-list">
              {cat.available && list.length > 0 ? (
                list.map((topic) => (
                  <li key={topic.slug}>
                    <SidebarLink href={topic.href}>{topic.title}</SidebarLink>
                  </li>
                ))
              ) : (
                <li>
                  <SidebarLink href="#" disabled>
                    скоро
                  </SidebarLink>
                </li>
              )}
            </ul>
          </div>
        );
      })}
    </aside>
  );
}
