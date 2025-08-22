// src/components/inmutable-components/CRUD/detail/PartDetails.tsx
import React from 'react'
import { Badge } from '@/components/reusable-components/badge'
// ✅ Import Description and Link from Lucide React
import { Clock, Hash, Layers, FileText, Play, File, Link } from 'lucide-react'

// ✅ Cập nhật Part interface
interface Part {
  id: number
  name: string
  type: 'video' | 'document' // ✅ Thay đổi 'exercise' thành 'document'
  moduleId: number
  moduleName: string
  status: 'active' | 'inactive'
  content?: string // ✅ Thêm trường content
  videoUrl?: string // ✅ Thêm trường videoUrl
  duration?: string // ✅ Thêm trường duration
}

interface PartDetailsProps {
  part: Part
}

const PartDetails = ({ part }: PartDetailsProps) => {
  return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="text-xs bg-blue-100 text-blue-800">
              {part.type}
            </Badge>
          </div>
          <h3 className="text-2xl font-black text-gray-800 mb-2">
            {part.name}
          </h3>

          {/* ✅ Hiển thị nội dung hoặc URL */}
          {part.type === 'video' && part.videoUrl && (
              <div className="flex items-center gap-2 text-gray-600 break-all mt-4">
                <Link className="w-4 h-4" />
                <a href={part.videoUrl} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
                  {part.videoUrl}
                </a>
              </div>
          )}
          {part.type === 'document' && part.content && (
              <div className="text-gray-600 mt-4 text-sm">
                <p className="text-sm font-medium text-gray-600 mb-2">Content:</p>
                <p>{part.content}</p>
              </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl">
              <Layers className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Module</p>
                <p className="font-bold text-gray-800">{part.moduleName}</p>
              </div>
            </div>
            {/* ✅ Thêm hiển thị Duration */}
            {part.duration && (
                <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-2xl">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Duration</p>
                    <p className="font-bold text-gray-800">{part.duration}</p>
                  </div>
                </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl">
              {part.type === 'video' ? (
                  <Play className="w-5 h-5 text-green-600" />
              ) : (
                  <FileText className="w-5 h-5 text-green-600" />
              )}
              <div>
                <p className="text-sm font-medium text-gray-600">Type</p>
                <p className="font-bold text-gray-800 capitalize">
                  {part.type}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Status</span>
            <Badge
                className={`text-sm font-bold rounded-full ${
                    part.status === 'active'
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : 'bg-gray-100 text-gray-800 border-gray-200'
                }`}
            >
              {part.status}
            </Badge>
          </div>
        </div>
      </div>
  )
}

export default PartDetails