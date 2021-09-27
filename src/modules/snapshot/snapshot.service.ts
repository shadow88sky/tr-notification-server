import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { request, gql } from 'graphql-request';
import _ from 'lodash';
import { Repository } from 'typeorm';
import { Proposal } from './proposal.entity';
import { ProposalFields } from './proposal.payload';

@Injectable()
export class SnapshotService {
  constructor(
    @InjectRepository(Proposal)
    private readonly proposalRepository: Repository<Proposal>,
  ) {}

  /**
   * create
   * @param payload
   * @returns
   */
  async create(payload: ProposalFields) {
    let proposal: Proposal = new Proposal();
    proposal.proposalId = payload.id;
    proposal.body = payload.body;
    proposal.title = payload.title;
    proposal.choices = payload.choices;
    proposal.start = payload.start;
    proposal.end = payload.end;
    proposal.snapshot = payload.snapshot;
    proposal.state = payload.state;
    proposal.author = payload.author;
    proposal.created = payload.created;
    proposal.plugins = payload.plugins;
    proposal.network = payload.network;
    proposal.space_id = _.get(payload, 'space.id');
    proposal.space_name = _.get(payload, 'space.name');
    proposal.strategies = _.get(payload, 'strategies');

    return await this.proposalRepository.save(proposal);
  }

  /**
   * querySnapshotProposals
   * @param variables
   * @returns
   */
  async querySnapshotProposals(variables) {
    const query = gql`
      query Proposal($id: String!) {
        proposal(id: $id) {
          id
          title
          body
          choices
          start
          end
          snapshot
          state
          author
          created
          plugins
          network
          strategies {
            name
            params
          }
          space {
            id
            name
          }
        }
      }
    `;

    return await request('https://hub.snapshot.org/graphql', query, variables);
  }

  /**
   *
   * @param conditions
   *
   * @param payload
   * @returns
   */
  async update(conditions, payload: ProposalFields) {
    return await this.proposalRepository.update(conditions, payload);
  }

  /**
   *
   * @param proposal
   */
  async handleWebhook(payload) {
    const proposal = await this.proposalRepository.findOne({
      proposalId: payload.id,
    });

    if (proposal) {
      let proposal: Proposal = new Proposal();
      proposal.start = payload.start;
      proposal.end = payload.end;
      proposal.snapshot = payload.snapshot;
      proposal.state = payload.state;
      return await this.update({ id: proposal.id }, proposal);
    }

    return await this.create(payload);
  }
}
