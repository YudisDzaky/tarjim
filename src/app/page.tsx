'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, Copy, ChevronRight, Save, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { id } from 'date-fns/locale'

export default function Component() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 10, 11)) // November 11, 2024
  const [isCopied, setIsCopied] = useState(false)
  const [currentJuzIndex, setCurrentJuzIndex] = useState(0)
  const [currentDayIndex, setCurrentDayIndex] = useState(0)
  const [juzSchedule, setJuzSchedule] = useState<Array<{ juz: number; surah: Array<{ day: string; content: string }> }>>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editedSchedule, setEditedSchedule] = useState<Array<{ juz: number; surah: Array<{ day: string; content: string }> }>>([])
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize juzSchedule with 30 Juz if it's empty
    if (juzSchedule.length === 0) {
      const initialSchedule = Array.from({ length: 30 }, (_, i) => ({
        juz: i + 1,
        surah: [
          { day: 'SENIN', content: `Juz ${i + 1} Senin content` },
          { day: 'SELASA', content: `Juz ${i + 1} Selasa content` },
          { day: 'RABU', content: `Juz ${i + 1} Rabu content` },
          { day: 'KAMIS', content: `Juz ${i + 1} Kamis content` },
          { day: 'JUM\'AT', content: `Juz ${i + 1} Jum'at content` },
          { day: 'SABTU', content: `Juz ${i + 1} Sabtu content` },
          { day: 'MINGGU', content: `Juz ${i + 1} Minggu content` },
        ]
      }))
      setJuzSchedule(initialSchedule)
      setEditedSchedule(initialSchedule)
    }
  }, [juzSchedule])

  const getDayName = (date: Date) => {
    const days = ['MINGGU', 'SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUM\'AT', 'SABTU']
    return days[date.getDay()]
  }

  const formatDate = (date: Date) => {
    return format(date, 'dd MMMM yyyy', { locale: id })
  }

  const getJuzAndSurah = () => {
    const currentJuz = juzSchedule[currentJuzIndex]
    const currentSurah = currentJuz?.surah[currentDayIndex]

    return {
      juz: currentJuz?.juz || 1,
      surah: currentSurah?.content || 'Not specified'
    }
  }

  const { juz, surah } = getJuzAndSurah()

  const names = [
    'ROGHIB', 'RAHMA RD', 'HUSNUL ADHIM', 'ALIYAH', 'LASIYAH',
    'HAMLA', 'KHUSNUR ROFI\'AH', 'MUSRIFAH', 'MAISAROH', 'UTAMI',
    'WIWIT', 'DIDIK', 'ZAHRA', 'YANI', 'RATNA AGUNG',
    'CIK FA', 'MASKINAH', 'MILYAKUN', 'YUSIANA', 'SUMIATI',
    'DIAN', 'JUWANTORO', 'KHASIB', 'YUSUF', 'YULIA',
    'SILVIA', 'HENDIANA', '---', '---', '---'
  ]

  const copyToClipboard = () => {
    if (contentRef.current) {
      const content = contentRef.current.innerText
      navigator.clipboard.writeText(content).then(() => {
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000) // Reset after 2 seconds
      })
    }
  }

  const changeDay = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate)
      newDate.setDate(newDate.getDate() + 1)
      return newDate
    })
    setCurrentDayIndex((prevDayIndex) => {
      const newDayIndex = (prevDayIndex + 1) % 7
      if (newDayIndex === 0) {
        // If it's the last day of the week, move to the next Juz
        setCurrentJuzIndex((prevJuzIndex) => (prevJuzIndex + 1) % juzSchedule.length)
      }
      return newDayIndex
    })
  }

  const handleJuzContentChange = (juzIndex: number, dayIndex: number, content: string) => {
    setEditedSchedule(prevSchedule => {
      const newSchedule = [...prevSchedule]
      newSchedule[juzIndex].surah[dayIndex].content = content
      return newSchedule
    })
  }

  const saveChanges = () => {
    setJuzSchedule(editedSchedule)
    setIsEditing(false)
  }

  const handleStartingJuzChange = (value: string) => {
    const juzIndex = parseInt(value) - 1
    setCurrentJuzIndex(juzIndex)
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setCurrentDate(date)
      setCurrentDayIndex(date.getDay())
    }
  }

  const handleDayChange = (value: string) => {
    const dayIndex = ['MINGGU', 'SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUM\'AT', 'SABTU'].indexOf(value)
    if (dayIndex !== -1) {
      setCurrentDayIndex(dayIndex)
      setCurrentDate(prevDate => {
        const newDate = new Date(prevDate)
        newDate.setDate(newDate.getDate() - newDate.getDay() + dayIndex)
        return newDate
      })
    }
  }

  return (
    <div className="font-mono text-sm bg-white text-black p-4 rounded-lg shadow-lg max-w-md mx-auto">
      <div className="mb-4">
        {!isEditing ? (
          <div ref={contentRef}>
            <div className="text-center mb-4">...‎بِسْمِ اللّهِ الرَّحْمَنِ الرَّحِيْم</div>
            <div className="text-center font-bold mb-2">
              "DAILY TARJIM 2"
              <br />
              AR RAHMAH
            </div>
            <div className="text-center mb-4">
              {getDayName(currentDate)}, {formatDate(currentDate)}
            </div>
            <div className="mb-4">
              📖 JUZ {juz}
              <br />
              📚 {surah}
            </div>
            {names.map((name, index) => (
              <div key={index} className="mb-1">
                {`${index < 9 ? '0⃣' : ''}${(index + 1).toString().split('').map(digit => `${digit}⃣`).join('')} ${name}`}
              </div>
            ))}
            <div className="mt-4">
              ♦️Laporan ditunggu sampai pukul 21.00
            </div>
            <div className="mt-2 text-center">
              📚 Salam istiqamah 😊
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Edit Juz Schedule</h2>
            {editedSchedule.map((juz, juzIndex) => (
              <div key={juzIndex} className="border p-4 rounded">
                <h3 className="font-bold mb-2">Juz {juz.juz}</h3>
                {juz.surah.map((day, dayIndex) => (
                  <div key={dayIndex} className="mb-2">
                    <Label htmlFor={`juz-${juz.juz}-${day.day}`}>{day.day}</Label>
                    <Input
                      id={`juz-${juz.juz}-${day.day}`}
                      value={day.content}
                      onChange={(e) => handleJuzContentChange(juzIndex, dayIndex, e.target.value)}
                      placeholder={`Enter content for ${day.day}`}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col space-y-2 mt-4">
        <div className="flex justify-between items-center">
          <Select onValueChange={handleStartingJuzChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select starting Juz" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 30 }, (_, i) => (
                <SelectItem key={i} value={(i + 1).toString()}>
                  Juz {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[180px] pl-3 text-left font-normal">
                {currentDate ? format(currentDate, "PPP") : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={currentDate}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex justify-between items-center">
          <Select onValueChange={handleDayChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              {['MINGGU', 'SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUM\'AT', 'SABTU'].map((day) => (
                <SelectItem key={day} value={day}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!isEditing ? (
            <Button
              onClick={changeDay}
              size="sm"
              variant="outline"
              aria-label="Change Day"
            >
              Next Day <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={saveChanges}
              size="sm"
              variant="outline"
              aria-label="Save Changes"
            >
              <Save className="h-4 w-4 mr-2" /> Save Changes
            </Button>
          )}
        </div>
        <div className="flex justify-between items-center">
          <Button
            onClick={copyToClipboard}
            size="sm"
            variant="outline"
            aria-label={isCopied ? "Copied to clipboard" : "Copy to clipboard"}
          >
            {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {isCopied ? "Copied" : "Copy"}
          </Button>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            size="sm"
            variant="outline"
          >
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </div>
      </div>
    </div>
  )
}