import React, { useState } from 'react'
import './Menu.css'

export default function Menu({ items, orientation = 'horizontal' }) {
  const [activeKey, setActiveKey] = useState(items[0]?.key || null)

  return (
    <nav className={`menu menu-${orientation}`}>
      <ul className="menu-list">
        {items.map((item) => (
          <li key={item.key} className="menu-item">
            <a
              href={item.href}
              className={`menu-link ${activeKey === item.key ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                setActiveKey(item.key)
                if (item.onClick) item.onClick()
              }}
            >
              {item.icon && <span className="menu-icon">{item.icon}</span>}
              <span className="menu-label">{item.label}</span>
              {item.badge && <span className="menu-badge">{item.badge}</span>}
            </a>
            {item.children && activeKey === item.key && (
              <ul className="menu-submenu">
                {item.children.map((child) => (
                  <li key={child.key} className="menu-item">
                    <a href={child.href} className="menu-link">
                      {child.icon && <span className="menu-icon">{child.icon}</span>}
                      <span className="menu-label">{child.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
