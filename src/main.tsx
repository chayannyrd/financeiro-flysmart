import React from 'react'
import { createRoot } from 'react-dom/client'
import GlobalStyle from 'styles/global'
import ExcelJS from 'exceljs'
import Papa from 'papaparse';

function App() {
  // refs
  const input_ref = React.useRef({} as HTMLInputElement)
  const anchor_ref = React.useRef({} as HTMLAnchorElement)
  // callbacks
  async function onClick() {
    const input = input_ref.current
    if (!input.files.length) {
      return alert("Selecione um arquivo CSV primeiro!")
    }
    const file = input.files[0]
    const json: string[][] = await new Promise(resolve => {
      Papa.parse(file, {
        complete: (result) => resolve(result.data as string[][]),
      })
    })
    const columns_indexes = new Set()
    // sheet styles
    const monetary_numFmt = 'R$ #,##0.00'
    const alignment: Partial<ExcelJS.Alignment> = { horizontal: 'center' }
    //
    for (let y = 1; y < json.length; y++) {
      const row = json[y]
      for (let x = 0; x < row.length; x++) {
        const cell = row[x]
        if (cell) {
          columns_indexes.add(x)
        }
      }
    }
    columns_indexes.delete(4)
    columns_indexes.delete(5)
    columns_indexes.delete(17)
    for (let y = 0; y < json.length; y++) {
      json[y] = json[y].filter((_, i) => columns_indexes.has(i))
    }

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('FECHAMENTO')
    worksheet.addRow([])
    worksheet.addRow(['', ...json[0]]).eachCell((cell, i) => {
      if (i > 1) {
        cell.alignment = alignment
        cell.font = { color: { argb: 'FFFFFF' }, bold: true, size: 12 }
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '073763' }
        }
      }
    })
    for (let y = 1; y < json.length; y++) {
      worksheet.addRow(['', ...json[y]]).eachCell((cell, col) => {
        cell.alignment = alignment
        if (col === 5) {
          const value = cell.text
            .replace(/^R\$/, '')
            .replace(/,/g, '.')
          cell.value = parseInt(value)
          cell.numFmt = monetary_numFmt
        }
      })
    }
    for (let i = 0; i < worksheet.columns.length; i++) {
      if(i > 0) {
        const column = worksheet.columns[i]
        let width = 0
        column.eachCell((cell, row) => {
          const font_size = row === 2 ? 1.2 : 1.1
          width = Math.max(width, cell.text.length * font_size)
        })
        column.width = width
      }
    }
    worksheet.addRow([])
    const footer = worksheet.addRow(Array(worksheet.columns.length).fill(''))
    const total_cell = footer.findCell(4)
    total_cell.value = 'TOTAL'
    total_cell.font = { bold: true }
    total_cell.alignment = alignment
    const formula_cell = footer.findCell(5)
    formula_cell.value = {
      formula: `SUM(E3:E${parseInt(formula_cell.row) - 2})`
    }
    formula_cell.font = { bold: true }
    formula_cell.alignment = alignment
    formula_cell.numFmt = monetary_numFmt
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    anchor_ref.current.href = URL.createObjectURL(blob)
    anchor_ref.current.click()
  }
  // render
  return (
    <div className="container">
      <h2>Gerar Planilha Formatada</h2>
      <input ref={input_ref} type="file" accept=".csv" />
      <br />
      <button onClick={onClick}>Gerar Excel</button>
      <a ref={anchor_ref} hidden />
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <>
    <App />
    <GlobalStyle />
  </>,
)
