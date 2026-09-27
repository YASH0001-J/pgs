/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Inbox, Bell, Calendar, FileText, Download, TrendingUp, Users } from 'lucide-react';
import { NoticeItem, ExamScheduleItem, SchoolEventItem, DownloadResource } from '../../types';

interface Props {
  totalQueries: number;
  unreadQueries: number;
  notices: NoticeItem[];
  exams: ExamScheduleItem[];
  events: SchoolEventItem[];
  downloads: DownloadResource[];
}

export const AdminAnalyticsView: React.FC<Props> = ({
  totalQueries,
  unreadQueries,
  notices,
  exams,
  events,
  downloads
}) => {
  // Category distribution data
  const categoryCountData = [
    { name: 'Notices', count: notices.length, color: '#3b82f6' },
    { name: 'Exams', count: exams.length, color: '#0284c7' },
    { name: 'Events', count: events.length, color: '#10b981' },
    { name: 'Downloads', count: downloads.length, color: '#f59e0b' }
  ];

  // Downloads per resource category
  const downloadStatsData = [
    { name: 'Date Sheets', downloads: 1420 },
    { name: 'Prospectus', downloads: 3890 },
    { name: 'Forms', downloads: 2150 },
    { name: 'Fee Schedule', downloads: 1840 },
    { name: 'Syllabus', downloads: 1290 }
  ];

  const totalDownloadsCount = downloads.reduce((acc, curr) => acc + curr.downloadsCount, 0);
  const totalRsvpCount = events.reduce((acc, curr) => acc + (curr.registeredCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Circulars</span>
            <span className="text-2xl font-black text-primary font-mono">{notices.length}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Upcoming Events</span>
            <span className="text-2xl font-black text-primary font-mono">{events.length}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Downloads</span>
            <span className="text-2xl font-black text-primary font-mono">{totalDownloadsCount.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Event RSVPs</span>
            <span className="text-2xl font-black text-primary font-mono">{totalRsvpCount}</span>
          </div>
        </div>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Modules Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-primary text-base">Communication Hub Modules</h3>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">Live Stats</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryCountData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {categoryCountData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Download Metrics */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-primary text-base">Most Downloaded Resource Categories</h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">PDF Activity</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={downloadStatsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="downloads" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
