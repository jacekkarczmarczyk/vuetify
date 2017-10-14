export default {
  methods: {
    monthWheelScroll (e) {
      e.preventDefault()

      let year = this.tableYear

      if (e.deltaY < 0) year++
      else year--

      this.tableDate = `${year}`
    },
    monthClick (month) {
      // Updates inputDate setting 'YYYY-MM' or 'YYYY-MM-DD' format, depending on the picker type
      this.inputDate = this.type === 'date'
        ? this.sanitizeDateString(`${this.tableYear}-${month + 1}-${this.day}`, this.type)
        : this.sanitizeDateString(`${this.tableYear}-${month + 1}`, this.type)

      if (this.type === 'date') {
        this.activePicker = 'DATE'
      } else {
        this.$nextTick(() => (this.autosave && this.save()))
      }
    },
    monthGenTD (month) {
      const pad = n => n < 10 ? `0${n}` : `${n}`
      const date = `${this.tableYear}-${pad(month + 1)}`
      const monthName = this.monthFormat(date, this.locale)
      const isActive = this.monthIsActive(month)
      const isCurrent = this.monthIsCurrent(month)
      const classes = {
        'btn--flat': !isActive,
        'btn--active': isActive,
        'btn--outline': isCurrent && !isActive,
        'btn--disabled': this.type === 'month' && !this.isAllowed(date)
      }

      return this.$createElement('td', [
        this.$createElement('button', {
          staticClass: 'btn',
          'class': (isActive || isCurrent)
            ? this.addBackgroundColorClassChecks(classes, this.contentColorProp)
            : classes,
          attrs: {
            type: 'button'
          },
          domProps: {
            innerHTML: `<span class="btn__content">${monthName}</span>`
          },
          on: {
            click: () => this.monthClick(month)
          }
        })
      ])
    },
    monthGenTBody () {
      const children = []
      const cols = Array(3).fill(null)
      const rows = 12 / cols.length

      for (let row = 0; row < rows; row++) {
        children.push(this.$createElement('tr', cols.map((_, col) => {
          return this.monthGenTD(row * cols.length + col)
        })))
      }

      return this.$createElement('tbody', children)
    },
    monthIsActive (i) {
      return this.tableYear === this.year &&
        this.month === i
    },
    monthIsCurrent (i) {
      return this.currentYear === this.tableYear &&
        this.currentMonth === i
    }
  }
}
