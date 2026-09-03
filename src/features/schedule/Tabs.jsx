import "./Tabs.css";

export default function Tabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="b-tabs">
      <div className="b-tabs__header" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            className={`b-tabs__button ${activeTab === tab.id ? "is-active" : ""}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.icon && <span className="b-tabs__icon">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="b-tabs__content">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            id={`panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={tab.id}
            className={`b-tabs__panel ${activeTab === tab.id ? "is-active" : ""}`}
          >
            {activeTab === tab.id && tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
