# docs/outreach/enneagram-monthly/make-chart.py
# Figure 1 for the Enneagram Monthly article: share of each assigned type in three
# fields vs. the whole 9takes collection. Reads the dated snapshot written next to it.
import json
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt

HERE = Path(__file__).parent
snap = json.loads((HERE / "data-snapshot-2026-10-19.json").read_text())
baseline = snap["all"]["share"]
total = snap["all"]["n"]

PANELS = [
    ("comedy", "Comedians", "7"),
    ("music", "Musicians & artists", "4"),
    ("tech-business", "Tech, founders & business", "5"),
]
BAR, HIGHLIGHT, MARK = "#3B6EA5", "#C2620F", "#2B2B2B"
INK, MUTED, GRID = "#1F1F1F", "#5F5F5F", "#E4E4E4"
TYPES = [str(t) for t in range(1, 10)]

plt.rcParams.update({"font.family": "Helvetica", "font.size": 8.5, "text.color": INK})
fig, axes = plt.subplots(1, 3, figsize=(6.6, 2.75), sharey=True, dpi=300)

for ax, (slug, label, standout) in zip(axes, PANELS):
    field = snap["fields"][slug]
    shares = [field["share"][t] * 100 for t in TYPES]
    colors = [HIGHLIGHT if t == standout else BAR for t in TYPES]
    ax.bar(range(9), shares, width=0.72, color=colors, zorder=2)
    for i, t in enumerate(TYPES):
        ax.plot([i - 0.36, i + 0.36], [baseline[t] * 100] * 2, color=MARK, lw=1.4,
                solid_capstyle="butt", zorder=3)
    s = field["share"][standout] * 100
    ax.annotate(f"{s:.0f}%", (TYPES.index(standout), s), xytext=(0, 3),
                textcoords="offset points", ha="center", va="bottom",
                fontsize=8.5, fontweight="bold", color=INK)
    ax.set_title(f"{label}\n(n={field['n']})", fontsize=9, fontweight="bold", loc="left", pad=6)
    ax.set_xticks(range(9), TYPES)
    ax.tick_params(axis="both", length=0, colors=MUTED, labelsize=8)
    ax.set_xlabel("Assigned type", color=MUTED, fontsize=8)
    ax.set_ylim(0, 50)
    ax.set_yticks([0, 10, 20, 30, 40, 50], ["0%", "10%", "20%", "30%", "40%", "50%"])
    ax.grid(axis="y", color=GRID, lw=0.6, zorder=0)
    for side in ("top", "right", "left"):
        ax.spines[side].set_visible(False)
    ax.spines["bottom"].set_color("#BDBDBD")

handles = [
    plt.Rectangle((0, 0), 1, 1, color=BAR),
    plt.Rectangle((0, 0), 1, 1, color=HIGHLIGHT),
    plt.Line2D([0], [0], color=MARK, lw=1.4),
]
fig.legend(handles, ["Share of the field", "Type discussed in the text", f"All {total} profiles"],
           loc="lower center", ncol=3, frameon=False, fontsize=8, bbox_to_anchor=(0.5, -0.02))
fig.tight_layout(rect=(0, 0.07, 1, 1), w_pad=1.2)
out = HERE / "figure-1-type-share-by-field.png"
fig.savefig(out, dpi=300, facecolor="white")
print("wrote", out)
