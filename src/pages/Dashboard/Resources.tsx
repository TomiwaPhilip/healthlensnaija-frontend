import React, { useState } from "react";
import { Search, ExternalLink, Download, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardContent, CardFooter } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

const Resources = () => {
  const { t } = useTranslation("resources");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [hoveredCard, setHoveredCard] = useState(null);

  // Get resources and tag labels from translations
  const sampleResources = t("resources", { returnObjects: true });
  const tagLabels = t("tags", { returnObjects: true });

  const filteredResources = sampleResources.filter(
    (r) =>
      (!search || 
        r.title.toLowerCase().includes(search.toLowerCase()) || 
        r.description.toLowerCase().includes(search.toLowerCase())
      ) &&
      (filter === "all" || r.type === filter)
  );

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return (
          <Badge variant="outline" className="bg-red-50 text-foreground">
            PDF
          </Badge>
        );
      case "xlsx":
        return (
          <Badge variant="outline" className="bg-green-50 text-foreground">
            Excel
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-blue-50 text-foreground">
            Web
          </Badge>
        );
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-2 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground">{t("title")}</h1>
        <span className="text-sm text-muted-foreground">
          {t("labels.available", { count: filteredResources.length })}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-8">{t("subtitle")}</p>

      {/* Filters */}
      <div className="mb-8">
        <div className="relative mb-4">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search size={16} />
          </div>
          <Input
            placeholder={t("searchPlaceholder")}
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.entries(tagLabels).map(([key, label]) => {
            const isActive = filter === key;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
                  isActive
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "bg-background border border-border text-foreground hover:bg-accent/5"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Resource Cards */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res, i) => (
            <Card
              key={i}
              className={`transition-transform duration-150 hover:-translate-y-1 hover:shadow-lg flex flex-col overflow-hidden`}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex gap-4 p-6">
                <div className="flex-shrink-0 flex flex-col items-center justify-start">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                    <FileText size={20} />
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">{res.fileType.toUpperCase()}</div>
                </div>

                <div className="flex-1 min-w-0 flex flex-col">
                  {/* First row: title, description, actions */}
                  <div>
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-foreground truncate">{res.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{res.description}</p>
                    </div>

                    {/* Action row: download/view button under description (full width) */}
                    <div className="mt-3">
                      <Button asChild size="sm" className="w-full justify-center">
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={res.fileType !== "web" && res.fileType !== "pdf" ? true : undefined}
                          className="w-full flex items-center justify-center gap-2"
                        >
                          {res.fileType === "web" ? t("actions.viewDocs") : t("actions.download")} <Download size={14} />
                        </a>
                      </Button>
                    </div>

                    {/* Second row: category (left) and file size/updated (right) */}
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <Badge variant="outline" className="bg-accent/5 text-foreground">{tagLabels[res.type]}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {res.fileSize ? t("labels.fileSize", { size: res.fileSize }) : res.updated}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <div className="text-muted-foreground mb-4">{t("labels.noResults")}</div>
          <Button
            variant="link"
            onClick={() => {
              setSearch("");
              setFilter("all");
            }}
          >
            {t("actions.clearFilters")}
          </Button>
        </Card>
      )}

      {/* QuickInsights Panel */}
      <Card className="mt-12">
        <CardContent className="flex items-start gap-4 p-6">
          <div className="text-2xl">🧠</div>
          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">{t("quickInsight.title")}</h2>
            <blockquote className="text-muted-foreground italic">{t("quickInsight.quote")}</blockquote>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Resources;
