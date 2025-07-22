// src/components/inmutable-components/CRUD/detail/PartDetails.tsx
import React from 'react'
import { Badge } from '@/components/reusable-components/badge'
import { Clock, Hash, Layers, FileText, Play } from 'lucide-react'

interface Part {
  id: number
  name: string
  type: 'video' | 'exercise'
  moduleId: number
  moduleName: string
  orderIndex: number
  duration: string
  status: 'active' | 'inactive'
}

interface PartDetailsProps {
  part: Part
}

const PartDetails = ({ part }: PartDetailsProps) => {
  return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-bold text-green-600 bg-green-200 px-3 py-1 rounded-full">
            Part #{part.orderIndex}
          </span>
            <Badge className="text-xs bg-blue-100 text-blue-800">
              {part.type}
            </Badge>
          </div>
          <h3 className="text-2xl font-black text-gray-800 mb-2">
            {part.name}
          </h3>
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

            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-2xl">
              <Hash className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Order</p>
                <p className="font-bold text-gray-800">#{part.orderIndex}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-2xl">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Duration</p>
                <p className="font-bold text-gray-800">{part.duration}</p>
              </div>
            </div>

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
