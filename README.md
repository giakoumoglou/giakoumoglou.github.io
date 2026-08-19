# giakoumoglou.github.io

Personal site. All content lives in `_data/`. GitHub rebuilds and publishes the
site automatically on every push, so editing a YAML file in the GitHub web
editor is enough to update the live page. It goes live in roughly a minute.

```
_config.yml              Jekyll settings
index.html               page structure (rarely needs editing)
_includes/               the template for one publication entry
assets/
  style.css              all styling
  main.js                theme toggle, bib highlighting, copy button
  nikos.jpg              profile photo
_data/
  profile.yml            name, photo, bio, social links
  news.yml               the News table
  publications.yml       every paper, accepted and under review
  cv.yml                 interests, education, teaching, service
  linktypes.yml          registry of publication link buttons
```

## Adding a news item

Add two lines at the **top** of `_data/news.yml`. Links are markdown.

```yaml
- date: Sep 1, 2026
  text: Paper accepted at [NeurIPS 2026](https://neurips.cc/) (San Diego, US)
```

## Adding a paper

Add a block to `_data/publications.yml`. Accepted papers are grouped by `year`
automatically; the year headings appear on their own, newest first.

`key` follows the BibTeX citekey convention `<author><year><method>`, for
example `giakoumoglou2024synco`. Keep it identical to the citekey in `bib`.

```yaml
- key: giakoumoglou2026example
  status: accepted          # accepted | review
  year: 2026
  badge: NeurIPS            # short venue name in the left column
  title: My Paper Title
  authors: N. Giakoumoglou, T. Stathaki
  venue: In NeurIPS, 2026   # the italic line
  links:
    - {type: arxiv, id: "2601.12345"}
    - {type: code, id: giakoumoglou/repo}
  abstract: >
    One paragraph.
  bib: |
    @inproceedings{giakoumoglou2026example,
    ...
    }
```

`abstract` and `bib` are both optional; leave one out and its button disappears.

## Moving a paper from Under Review to Accepted

Change `status: review` to `status: accepted`, set `year`, `venue` and `badge`.
The entry moves sections on its own. You can leave it where it sits in the file.

## Link types

`type` refers to an entry in `_data/linktypes.yml`, which holds the icon, label
and URL pattern. `id` fills in the `{id}` placeholder, so
`{type: arxiv, id: "2410.02401"}` becomes a labelled arXiv button pointing at
`https://arxiv.org/abs/2410.02401`.

Available: `arxiv`, `code`, `openreview`, `ieee`, `mdpi`, `scitepress`, `doi`.
For anything else, give a full address instead of an id:

```yaml
    - {type: web, label: Project page, url: "https://example.com"}
```

Add a new publisher by adding three lines to `_data/linktypes.yml`. Any
[Font Awesome](https://fontawesome.com/icons) or
[Academicons](https://jpswalsh.github.io/academicons/) class works as an icon.

## Notes

- Do **not** add a `.nojekyll` file. It switches the build off.
- If a YAML edit has a syntax error the build fails and the site keeps serving
  the previous version. GitHub emails you. The usual culprit is an unquoted
  value containing a colon, as in `title: SynCo: Synthetic...`. Wrap the whole
  value in double quotes when it contains `:` or starts with `@`.
- `abstract` is rendered as HTML, so write `&amp;` for a literal ampersand and
  use tags like `<sup>` freely. `bib` is escaped for you, so paste it verbatim.

## Local preview (optional)

```
bundle install
bundle exec jekyll serve
```
