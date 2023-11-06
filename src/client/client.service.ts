import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';

import { Queue } from 'bull';
import { parse } from 'node-xlsx';
import { PrismaStreams } from 'prisma-extension-streams';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class ClientService {
  constructor(@InjectQueue('nsights') private queue: Queue, private readonly prisma: PrismaService) { }


  async createByFile(file: any) {
    for await (const row of file) {
      const data = parse(row, {
        cellDates: true,
        cellNF: false,
        cellText: false
      })[0].data
      data.map(async (enterpriseInfo) => {
        if (enterpriseInfo[0] === "ORGANIZATION NAME") {
          return
        }
        const enterpriseToSave = {
          orgName: enterpriseInfo[0],
          contactJobDep: enterpriseInfo[1],
          industries: enterpriseInfo[2]?.split(","),
          hqLocation: enterpriseInfo[3],
          country: enterpriseInfo[4],
          description: enterpriseInfo[5],
          foundedDate: enterpriseInfo[6],
          foundedDatePrecision: enterpriseInfo[7],
          founders: enterpriseInfo[8]?.split(","),
          employeesRange: enterpriseInfo[9],
          fundingStatus: enterpriseInfo[10],
          lastFundingDate: enterpriseInfo[11],
          lastFundingType: enterpriseInfo[12],
          numberOfInvestiments: parseInt(enterpriseInfo[13]) || 0,
          numberOfExits: parseInt(enterpriseInfo[14]) || 0,
          industryGroups: enterpriseInfo[15]?.split(","),
          ipoStatus: enterpriseInfo[16],
          ipoDate: enterpriseInfo[17],
          delistedDate: enterpriseInfo[18],
          delisteDatePrecision: enterpriseInfo[19],
          moneyRaisedAtIpo: parseFloat(enterpriseInfo[20]) || 0,
          moneyRaisedAtIpoCurrency: enterpriseInfo[21],
          moneyRaisedAtIpoCurrencyInUsd: parseFloat(enterpriseInfo[22]) || 0,
          valuationAtIpo: parseFloat(enterpriseInfo[23]) || 0,
          valuationAtIpoCurrency: enterpriseInfo[24],
          valuationAtIpoCurrencyInUsd: parseFloat(enterpriseInfo[25]) || 0,
          //alfabeto inicia dnv
          stockExchange: enterpriseInfo[26], //1
          diversitySpotlight: enterpriseInfo[27],
          numberDiversityInvestments: enterpriseInfo[28],
          transactionName: enterpriseInfo[29],
          acquiredBy: enterpriseInfo[30],
          announcedDate: enterpriseInfo[31],
          announcedDatePrecision: enterpriseInfo[32],
          price: parseFloat(enterpriseInfo[33]) || 0,
          priceCurrency: enterpriseInfo[34],
          priceCurrencyInUsd: parseFloat(enterpriseInfo[35]) || 0,//10
          lastLeadershipHiringDate: enterpriseInfo[36],
          cbRankPerOrganization: parseInt(enterpriseInfo[37]) || 0,
          cbRankPerCompany: parseInt(enterpriseInfo[38]) || 0,
          cbRankPerSchool: parseInt(enterpriseInfo[39]) || 0,
          lastLayoffDate: enterpriseInfo[40],
          headquartersRegions: enterpriseInfo[41],
          estimatedRevenueRange: enterpriseInfo[42],
          operatingStatus: enterpriseInfo[43],
          website: enterpriseInfo[44],
          twitter: enterpriseInfo[45],//20
          facebook: enterpriseInfo[46],
          linkedin: enterpriseInfo[47],
          contactEmail: enterpriseInfo[48],
          phone: enterpriseInfo[49],
          numberOfArticles: parseInt(enterpriseInfo[50]) || 0,
          hubTags: enterpriseInfo[51],
          //alfabeto inicia dnv
          fullDescription: enterpriseInfo[52], //1
          activelyHiring: enterpriseInfo[53],
          investmentStage: enterpriseInfo[54],
          numberOfFoundersAlumni: enterpriseInfo[55],
          numberOfFounders: enterpriseInfo[56],
          numberOfFundingRounds: enterpriseInfo[57],
          totalFundingAmount: parseFloat(enterpriseInfo[58]) || 0,
          totalFundingAmountCurrency: enterpriseInfo[59],
          totalFundingAmountCurrencyInUsd: parseFloat(enterpriseInfo[60]) || 0,
          numberOfAcquisitions: parseInt(enterpriseInfo[61]) || 0,//10
          stockSymbol: enterpriseInfo[62],
          similarCompanies: parseInt(enterpriseInfo[63]) || 0,
          monthlyVisits: parseInt(enterpriseInfo[64]) || 0,
          averageVisits: parseFloat(enterpriseInfo[65]) || 0,
          visitDuration: parseInt(enterpriseInfo[66]) || 0,
          monthlyVisitsGrowth: parseFloat(enterpriseInfo[67]) || 0,
          visitDurationGrowth: parseFloat(enterpriseInfo[68]) || 0,
          pageViews: parseFloat(enterpriseInfo[69]) || 0,
          pageViewsGrowth: parseFloat(enterpriseInfo[70]) || 0,
          bounceRate: parseFloat(enterpriseInfo[71]) || 0,//20
          bounceRateGrowth: parseFloat(enterpriseInfo[72]) || 0,
          globalTrafficRank: parseInt(enterpriseInfo[73]) || 0,
          monthlyRankChange: parseInt(enterpriseInfo[74]) || 0,
          monthlyRankGrowth: parseFloat(enterpriseInfo[75] || 0),
          itSpend: parseFloat(enterpriseInfo[76]) || 0,
          itSpendCurrency: enterpriseInfo[77],
          //alfabeto inicia dnv
          itSpendInUsd: parseFloat(enterpriseInfo[78]) || 0,//1
          patentsGranted: parseInt(enterpriseInfo[79]) || 0,
          trademarksRegistered: parseInt(enterpriseInfo[80]) || 0,
          mostPopularPatentClass: enterpriseInfo[81],
          mostPopularTrademarkClass: enterpriseInfo[82],
          numberOfApps: parseInt(enterpriseInfo[83]) || 0,
          downloadLastThirtyDays: parseInt(enterpriseInfo[84]) || 0,//jump
          industryLinkedin: enterpriseInfo[86],
          companyStreet: enterpriseInfo[91],
          companyCity: enterpriseInfo[92],
          companyState: enterpriseInfo[93],
          companyCountry: enterpriseInfo[94],
          companyPostalCode: enterpriseInfo[95],
          companyAddress: enterpriseInfo[96],
          keywords: enterpriseInfo[97]?.split(","),
          companyPhone: enterpriseInfo[98],
          seoDescription: enterpriseInfo[99],
          technologies: enterpriseInfo[100]?.split(","),
          sicCodes: enterpriseInfo[101],
          shortDescription: enterpriseInfo[102],
        }
        await this.sendEvent("migrate", JSON.stringify({ data: enterpriseToSave }))
      })
    }
    Logger.log("Migration completely sent to worker!")
  }

  async updateImages(file: any) {
    try {
      for await (const row of file) {
        const data = parse(row, {
          cellDates: true,
          cellNF: false,
          cellText: false
        })[0].data
        data.map(async (rows) => {
          const imageData = { website: rows[0], url: rows[1] }
          await this.sendEvent("updateImage", JSON.stringify({ data: imageData }))
        })
      }
      Logger.log("Migration completely sent to worker!")
    } catch (error) {
      Logger.error(error)
    }
  }


  async createViews(filter: string) {
    try {
      await this.sendEvent(filter, JSON.stringify({}))

    } catch (error) {
      Logger.error(error)
    }

  }


  async sendEvent(pattern: string, data: any) {
    try {
      await this.queue.add(pattern, data,
        {
          attempts: 5,
          backoff: 8000,
        })
    } catch (error) {
      Logger.error(error)
    }
  }
}


