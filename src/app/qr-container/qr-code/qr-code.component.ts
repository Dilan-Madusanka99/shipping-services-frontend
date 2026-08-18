import { AfterViewInit, Component, ElementRef, inject, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import QRCode from 'qrcode';
import { environment } from 'src/app/environments/environment';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';

@Component({
  selector: 'app-qr-code',
  standalone: false,
  templateUrl: './qr-code.component.html',
  styleUrl: './qr-code.component.scss'
})
export class QrCodeComponent implements AfterViewInit {
  @ViewChild('qrCanvas') qrCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  isCardGenerated = true;   // card markup is always in the DOM; no fake "generating" phase
  isGenerating = false;
  attendanceUrl = '';
  userData: any = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { value: any },
    private messageService: MessageServiceService,
    public dialogRef: MatDialogRef<QrCodeComponent>
  ) {
    this.userData = this.data.value;
  }

  ngAfterViewInit(): void {
    // Canvas already exists in the DOM (only hidden via display), so draw now.
    this.generateQRCode();
  }

  async generateQRCode(): Promise<void> {
    const canvas = this.qrCanvas?.nativeElement;
    if (!canvas) return;

    this.attendanceUrl =
      `${environment.baseUrl}/employeeAttendence/mark-attendance/present/${this.userData.empNo}`;

    try {
      await QRCode.toCanvas(canvas, this.attendanceUrl, {
        width: 120,
        margin: 1,
        color: { dark: '#1f2937', light: '#ffffff' }
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  }

  public async downloadId(): Promise<void> {
  if (this.isGenerating) return;
  this.isGenerating = true;

  try {
    const W = 90;                       // card width in mm
    const H = 115;                      // card height in mm
    const pdf = new jsPDF('p', 'mm', [W, H]);

    const blue: [number, number, number] = [25, 118, 210];

    // ---------- Header ----------
    pdf.setFillColor(...blue);
    pdf.rect(0, 0, W, 18, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text(`${this.userData.jobTitle || 'Member'} ID Card`, W / 2, 11, { align: 'center' });

    // ---------- Avatar ----------
    const cx = 18, cy = 34, r = 10;
    if (this.userData?.profileImage) {
      const fmt = (this.userData.profileImageType || 'image/png').includes('png') ? 'PNG' : 'JPEG';
      const imgUrl = `data:${this.userData.profileImageType};base64,${this.userData.profileImage}`;
      try {
        pdf.saveGraphicsState();
        pdf.circle(cx, cy, r);
        pdf.clip();
        pdf.discardPath();
        pdf.addImage(imgUrl, fmt, cx - r, cy - r, r * 2, r * 2);
        pdf.restoreGraphicsState();
      } catch {
        pdf.addImage(imgUrl, fmt, cx - r, cy - r, r * 2, r * 2);
      }
    } else {
      pdf.setFillColor(...blue);
      pdf.circle(cx, cy, r, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(13);
      const initials =
        `${this.userData.firstName?.charAt(0) ?? ''}${this.userData.lastName?.charAt(0) ?? ''}`;
      pdf.text(initials.toUpperCase(), cx, cy + 1.5, { align: 'center' });
    }

    // ---------- Name + details ----------
    let x = 33;
    pdf.setTextColor(51, 51, 51);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(13);
    pdf.text(`${this.userData.firstName} ${this.userData.lastName}`, x, 30);

    const rows: [string, string][] = [
      ['ID:', `${this.userData.empNo ?? ''}`],
      ['Email:', `${this.userData.email ?? ''}`],
      ['Phone:', `${this.userData.contactNo ?? ''}`]
    ];
    let y = 38;
    pdf.setFontSize(8.5);
    for (const [label, value] of rows) {
      pdf.setTextColor(...blue);
      pdf.setFont('helvetica', 'bold');
      pdf.text(label, x, y);
      pdf.setTextColor(85, 85, 85);
      pdf.setFont('helvetica', 'normal');
      pdf.text(value, x + pdf.getTextWidth(label) + 2, y);
      y += 5.5;
    }

    // ---------- QR ----------
    const qrData = this.qrCanvas.nativeElement.toDataURL('image/png');
    const qrSize = 34;
    const qrX = (W - qrSize) / 2;
    const qrY = 58;

    pdf.setDrawColor(200, 200, 200);
    pdf.setLineDashPattern([1, 1], 0);
    pdf.roundedRect(qrX - 3, qrY - 3, qrSize + 6, qrSize + 6, 2, 2, 'S');
    pdf.setLineDashPattern([], 0);
    pdf.addImage(qrData, 'PNG', qrX, qrY, qrSize, qrSize);

    pdf.setTextColor(...blue);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.text('Scan for attendance', W / 2, qrY + qrSize + 8, { align: 'center' });

    pdf.setTextColor(120, 120, 120);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.text('Scan this QR code to mark attendance', W / 2, qrY + qrSize + 13, { align: 'center' });

    // ---------- Footer ----------
    pdf.setDrawColor(224, 224, 224);
    pdf.line(0, H - 12, W, H - 12);
    pdf.setTextColor(136, 136, 136);
    pdf.setFontSize(6.5);
    pdf.text('This card is property of the company. If found, please return.',
      W / 2, H - 6, { align: 'center' });

    pdf.save(`${this.userData.empNo ?? this.userData.memberNo}.pdf`);

    this.closeDialog();
    this.messageService.showSuccess('ID card downloaded successfully!');
  } catch (error) {
    this.messageService.showError('Error downloading ID card');
    console.error(error);
  } finally {
    this.isGenerating = false;
  }
}

  closeDialog(): void {
    this.dialogRef.close();
  }
}