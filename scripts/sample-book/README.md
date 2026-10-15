# Printable sample book (the Jones family)

Builds `public/books/treename-sample-book-<lang>.pdf` (200×250 mm, ~44 pages, ~1 MB).

    cd scripts/sample-book && npm i
    BOOK_LANG=ru OUT=../../public/books/treename-sample-book-ru.pdf node pdf.mjs

`pdf.mjs` uses Playwright with the Chromium at /opt/pw-browsers/chromium; change the path if needed.
Text lives in `content.<lang>.mjs`, portraits in `portraits.mjs`, heirloom drawings in `objects.mjs`.
The family is invented; places and history are real.
