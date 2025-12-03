import React from 'react'
import { createRoot } from 'react-dom/client'
import GlobalStyle from 'styles/global'
import ExcelJS from 'exceljs'
import Papa from 'papaparse';

function App() {
  // Referência para o input de arquivo (CSV)
  const input_ref = React.useRef({} as HTMLInputElement)

  // Referência para o link <a> usado para baixar o arquivo Excel
  const anchor_ref = React.useRef({} as HTMLAnchorElement)

  // Função que roda quando clica no botão "Gerar Excel"
  async function onClick() {
    const input = input_ref.current

    // Se nenhum arquivo foi selecionado, exibe alerta
    if (!input.files.length) {
      return alert("Selecione um arquivo CSV primeiro!")
    }

    // Pega o CSV enviado pelo usuário
    const file = input.files[0]

    // Lê o CSV e converte para JSON usando Papa Parse
    const json: string[][] = await new Promise(resolve => {
      Papa.parse(file, {
        complete: (result) => resolve(result.data as string[][]),
      })
    })

    // Conjunto para armazenar colunas que têm algum valor
    const columns_indexes = new Set()

    // Formatação monetária para o Excel
    const monetary_numFmt = 'R$ #,##0.00'

    // Alinhamento das células
    const alignment: Partial<ExcelJS.Alignment> = { horizontal: 'center' }

    // Percorre todo o CSV para descobrir quais colunas realmente têm dados
    for (let y = 1; y < json.length; y++) {
      const row = json[y]
      for (let x = 0; x < row.length; x++) {
        const cell = row[x]
        if (cell) {
          // Se a célula tiver conteúdo, marca a coluna X como válida
          columns_indexes.add(x)
        }
      }
    }

    // Remove colunas específicas que você decidiu excluir
    columns_indexes.delete(4)
    columns_indexes.delete(5)
    columns_indexes.delete(17)

    // Remove efetivamente essas colunas do JSON final
    for (let y = 0; y < json.length; y++) {
      json[y] = json[y].filter((_, i) => columns_indexes.has(i))
    }

    // Cria um novo arquivo Excel
    const workbook = new ExcelJS.Workbook()

    // Cria uma planilha chamada "FECHAMENTO"
    const worksheet = workbook.addWorksheet('FECHAMENTO')

    // Linha vazia (estética)
    worksheet.addRow([])

    // Insere o cabeçalho (linha 2 da planilha)
    worksheet.addRow(['', ...json[0]]).eachCell((cell, i) => {
      if (i > 1) {
        // Aplica centralização
        cell.alignment = alignment

        // Fonte do cabeçalho
        cell.font = { color: { argb: 'FFFFFF' }, bold: true, size: 12 }

        // Fundo azul escuro
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '073763' }
        }
      }
    })

    // Adiciona todas as linhas de dados
    for (let y = 1; y < json.length; y++) {
      worksheet.addRow(['', ...json[y]]).eachCell((cell, col) => {
        cell.alignment = alignment

        // Se for a coluna 5, trata como valor monetário
        if (col === 5) {
          const value = cell.text
            .replace(/^R\$/, '') // remove "R$"
            .replace(/,/g, '.')  // converte vírgula para ponto
          
          // Converte texto para número
          cell.value = Number(value)

          // Aplica formatação monetária R$
          cell.numFmt = monetary_numFmt
        }
      })
    }

    // Ajusta largura automática das colunas
    for (let i = 0; i < worksheet.columns.length; i++) {
      if(i > 0) {
        const column = worksheet.columns[i]
        let width = 0

        column.eachCell((cell, row) => {
          const font_size = row === 2 ? 1.2 : 1.1 // Linha 2 é o cabeçalho
          width = Math.max(width, cell.text.length * font_size)
        })

        column.width = width
      }
    }

    // Adiciona linha vazia antes do rodapé
    worksheet.addRow([])

    // Rodapé contendo TOTAL
    const footer = worksheet.addRow(Array(worksheet.columns.length).fill(''))

    // Célula onde fica a palavra "TOTAL"
    const total_cell = footer.findCell(4)
    total_cell.value = 'TOTAL'
    total_cell.font = { bold: true }
    total_cell.alignment = alignment

    // Célula onde fica a fórmula do total
    const formula_cell = footer.findCell(5)

    // Fórmula que soma os valores da coluna E
    formula_cell.value = {
      formula: `SUM(E3:E${parseInt(formula_cell.row) - 2})`
    }

    formula_cell.font = { bold: true }
    formula_cell.alignment = alignment
    formula_cell.numFmt = monetary_numFmt

    // Gera o arquivo Excel em memória
    const buffer = await workbook.xlsx.writeBuffer()

    // Cria um Blob para download
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })

    // Define o link para download e executa automaticamente
    anchor_ref.current.href = URL.createObjectURL(blob)
    anchor_ref.current.click()
  }

  // Renderização do componente
  return (
    <div className="container">
      <h2>Gerar Planilha Formatada</h2>

      {/* Input de upload CSV */}
      <input ref={input_ref} type="file" accept=".csv" />

      <br />

      {/* Botão para gerar o Excel */}
      <button onClick={onClick}>Gerar Excel</button>

      {/* Link oculto usado para baixar o arquivo */}
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
